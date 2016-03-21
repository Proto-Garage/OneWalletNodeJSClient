'use strict';

import request      from 'request';
import debug        from 'debug';
import Promise      from 'bluebird';
import { APIError } from './error';
import _            from 'lodash';
import {
  hash,
  hmac,
  Backoff
} from './utilities';

const logger = debug( 'onewallet:request' );

/** Class representing request. */
export default class Request {

  /**
   * Create a request
   * @param  {object} options                     Options
   * @param  {string} options.baseUrl             Request base url
   * @param  {string} options.method              Request method
   * @param  {string} options.uri                 Url path
   * @param  {object} options.body                Request body
   * @param  {string} options.accessId            Provider access id
   * @param  {string} options.secretKey           Provider secret key
   * @param  {object} options.maxNumRepeats       Maximum number of repeats
   * @param  {object} options.backoffInitialDelay Initial delay during backoff
   * @param  {number} options.timeout             Request timeout
   */
  constructor( options ) {

    this.options = _.merge( {
      method: 'GET',
      uri: '/',
      maxNumRepeats: 1,
      backoffInitialDelay: 50,
      timeout: 3000
    }, options );

    logger( 'request created', this.options );
  }

  /**
   * Send request and retry if communication error is encountered
   * @return {Promise}
   */
  send() {
    let self = this;

    let backoff = new Backoff( self.options.backoffInitialDelay );

    return new Promise( ( resolve, reject ) => {
      ( function sendRequest() {
        self.sendRequest().then( result => {
          if ( result instanceof Error ) {
            return reject( result );
          }

          resolve( result );
        }, err => {
          logger( 'request error', err );

          if ( backoff.count >= self.options.maxNumRepeats ) {
            err.retries = backoff.count;
            return reject( err );
          }

          backoff.backoff().then( () => {
            sendRequest();
          } );

        } );
      } )();
    } );
  }

  /**
   * Send the request
   * @return {Promise}
   */
  sendRequest() {
    let self = this;

    return new Promise( function( resolve, reject ) {
      let date = new Date(),
        method = self.options.method.toUpperCase(),
        body = ( method === 'GET' ) ? null : JSON.stringify( self.options.body ),
        uri = self.options.uri;

      // Calculate request signature
      let stringToSign = [
        method,
        uri,
        ( body ) ? hash( body ) : '',
        date.toUTCString()
      ].join( '\n' );
      let signature = hmac( stringToSign, self.options.secretKey );

      let opts = {
        baseUrl: self.options.baseUrl,
        uri,
        method: method,
        headers: {
          Date: date.toUTCString(),
          Authorization: `OW ${self.options.accessId}:${signature}`
        },
        timeout: self.options.timeout,
        json: false,
        strictSSL: false
      };

      if ( method !== 'GET' && body ) {
        opts.body = body;
        opts.headers[ 'Content-Type' ] = 'application/json';
      }

      request( opts, function( err, response ) {
        if ( err ) {
          return reject( err );
        }

        let result;

        try {
          result = JSON.parse( response.body );
        } catch ( err ) {
          result = response.body;
        }

        logger( 'response received', result, response.statusCode );
        if ( !_.includes( [ 200, 201 ], response.statusCode ) ) {
          return resolve( new APIError(
            ( result.code ) ? result.code : response.statusCode.toString(),
            ( result.message ) ? result.message : result
          ) );
        }
        resolve( result );

      } );
    } );
  }
}
