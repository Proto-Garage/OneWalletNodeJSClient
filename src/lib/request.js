'use strict';

import request       from 'request';
import debug         from 'debug';
import Promise       from 'bluebird';
import { APIError }  from './error';
import { hash, hmac} from './utilities';
import _             from 'lodash';

const logger = debug( 'onewallet-client:request' );

/** Class representing request. */
export default class Request {

  /**
   * Create a request
   * @param  {object} options                     Options
   * @param  {string} options.baseUrl             Request base url
   * @param  {string} options.method              Request method
   * @param  {string} options.path                Url path
   * @param  {object} options.body                Request body
   * @param  {string} options.accessId            Provider access id
   * @param  {string} options.secretKey           Provider secret key
   * @param  {object} options.maxNumRepeats       Maximum number of repeats
   * @param  {object} options.backoffInitialDelay Initial delay during backoff
   * @param  {number} options.timeout             Request timeout
   */
  constructor( options ) {

    this.options = _.defaultsDeep( {
      method: 'GET',
      path: '/',
      maxNumRepeats: 1,
      backoffInitialDelay: 50,
      timeout: 3000
    }, options );

    logger( 'request created', this.options );
  }

  backoff() {
    let self = this;

    if ( !self.backoff ) {
      self.backoff = {
        current: this.options.backoffInitialDelay,
        next: this.options.backoffInitialDelay,
        count: 0
      };
    }

    return new Promise( function( resolve, reject ) {
      if ( self.backoff.count >= self.options.maxNumRepeats ) {
        return reject( new APIError( 'ERR_REQUEST', 'Maximum number of repeats reached' ) );
      }

      setTimeout( function() {
        let next = self.backoff.current + self.backoff.next;
        self.backoff.current = self.backoff.next;
        self.backoff.next = next;
        self.backoff.count++;
        resolve();
      }, self.backoff.current );

    } );
  }

  /**
   * Send request and retry if communication error is encountered
   * @return {Promise}
   */
  send() {
    let self = this;
    return new Promise( function( resolve, reject ) {
      self.sendRequest().then( function( result ) {
        if ( result instanceof Error ) {
          return reject( result );
        }

        resolve( result );
      } ).catch( function( err ) {

        logger( 'request error', err );

        self.backoff().then( function() {
          self.send();
        } ).catch( reject );

      } );
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
        path = self.options.path;

      // Calculate request signature
      let stringToSign = [
        method,
        path,
        ( body ) ? hash( body ) : '',
        date.toUTCString()
      ].join( '\n' );
      let signature = hmac( stringToSign, self.options.secretKey );

      let opts = {
        baseUrl: self.options.baseUrl,
        path,
        method: method,
        headers: {
          Date: date.toUTCString,
          Authorization: `OW ${self.options.accessId}:${signature}`
        },
        timeout: self.options.timeout,
        json: false
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
        if ( response.statusCode !== 200 ) {
          return reject( new APIError(
            ( result.code ) ? result.code : 'ERR_REQUEST',
            ( result.message ) ? result.message : result
          ) );
        }
        resolve( result );

      } );
    } );
  }
}
