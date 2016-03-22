'use strict';

import _        from 'lodash';
import Request  from './lib/request';
import { uuid } from './lib/utilities';
import qs       from 'querystring';

export default class OneWalletServiceAPI {

  /**
   * Constructor
   * @param {object} options
   * @param {string} options.baseUrl
   * @param {string} options.accessId
   * @param {string} options.secretKey
   * @param {number} options.backoffInitialDelay
   * @param {number} options.timeout
   */
  constructor( options ) {
    this.options = _.merge( {
      baseUrl: 'https://api.as2bet.com',
      backoffInitialDelay: 50,
      timeout: 3000
    }, options );
  }

  applyConfig( data ) {
    return _.merge( _.pick( this.options, [
      'baseUrl',
      'accessId',
      'secretKey',
      'backoffInitialDelay',
      'timeout'
    ] ), data );
  }

  /**
   * Check validity of user credentials
   * @param {object} info
   * @param {string} info.username
   * @param {string} info.password
   */
  authenticateUser( info ) {
    return new Request( this.applyConfig( {
      method: 'POST',
      uri: '/users/authenticate',
      body: info,
      maxNumRepeats: 0
    } ) ).send();
  }

  /**
   * Create game session
   * @param {object} info
   * @param {string} info.userId
   */
  createGameSession( info ) {
    return new Request( this.applyConfig( {
      method: 'POST',
      uri: `/users/${ info.userId }/sessions`,
      body: _.omit( info, [
        'userId'
      ] ),
      maxNumRepeats: 0
    } ) ).send();
  }

  /**
   * Retrieve user info
   * @param {object} info
   * @param {string} info.userId
   * @param {array}  info.fields
   */
  getUserInfo( info ) {
    _.merge( {
      fields: [
        'balance',
        'currency',
        'username',
        'nickname',
        'firstName',
        'lastName',
        'birthday',
        'email'
      ]
    }, info );
    return new Request( this.applyConfig( {
      method: 'GET',
      uri: `/users/${ info.userId }?${ qs.stringify( { fields: info.fields.join( ',' ) } ) }`,
      maxNumRepeats: 0
    } ) ).send();
  }
  /**
   * Place bet
   * @param {object} info
   * @param {string} info.userId
   * @param {string} info.sessionId
   * @param {string} info.referenceId
   * @param {string} info.betAmount
   */
  bet( info ) {
    let transactionId = uuid();
    return new Request( this.applyConfig( {
      method: 'PUT',
      uri: `/users/${ info.userId }/transactions/${ transactionId }?` +
        `${ qs.stringify( { type: 'BET', sessionId: info.sessionId, referenceId: info.referenceId } ) }`,
      body: _.omit( info, [
        'userId',
        'sessionId',
        'referenceId'
      ] ),
      maxNumRepeats: 2
    } ) ).send();
  }

  /**
   * Place bet
   * @param {object} info
   * @param {string} info.userId
   * @param {string} info.sessionId
   * @param {string} info.referenceId
   * @param {string} info.winloss
   */
  result( info ) {
    let transactionId = uuid();
    return new Request( this.applyConfig( {
      method: 'PUT',
      uri: `/users/${ info.userId }/transactions/${ transactionId }?` +
        `${ qs.stringify( { type: 'RESULT', sessionId: info.sessionId, referenceId: info.referenceId } ) }`,
      body: _.omit( info, [
        'userId',
        'sessionId',
        'referenceId'
      ] ),
      maxNumRepeats: 2
    } ) ).send();
  }

  /**
   * Place bet
   * @param {object} info
   * @param {string} info.userId
   * @param {string} info.sessionId
   * @param {string} info.referenceId
   */
  cancel( info ) {
    let transactionId = uuid();
    return new Request( this.applyConfig( {
      method: 'PUT',
      uri: `/users/${ info.userId }/transactions/${ transactionId }?` +
        `${ qs.stringify( { type: 'CANCEL', sessionId: info.sessionId, referenceId: info.referenceId } ) }`,
      body: _.omit( info, [
        'userId',
        'sessionId',
        'referenceId'
      ] ),
      maxNumRepeats: 2
    } ) ).send();
  }
}
