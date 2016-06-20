'use strict';

import _        from 'lodash';
import Request  from './lib/request';
import { uuid } from './lib/utilities';
import qs       from 'querystring';

export default class OneWalletServiceAPI {

  /**
   * Constructor
   * @access public
   * @param {Object} options
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

  /**
   * Constructor
   * @access private
   */
  _applyConfig( data ) {
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
   * @access public
   * @param {Object} info
   * @param {string} info.username
   * @param {string} info.password
   */
  authenticateUser( info ) {
    return new Request( this._applyConfig( {
      method: 'POST',
      uri: '/users/authenticate',
      body: info,
      maxNumRepeats: 0
    } ) ).send();
  }

  /**
   * Create game session
   * @access public
   * @param {Object} info
   * @param {string} info.userId
   */
  createGameSession( info ) {
    return new Request( this._applyConfig( {
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
   * @access public
   * @param {Object} info
   * @param {string} info.userId
   * @param {string[]}  info.fields
   */
  getUserInfo( info ) {
    info = _.defaults( info, {
      fields: [
        'balance',
        'currency',
        'country',
        'username',
        'nickname',
        'firstName',
        'lastName',
        'birthday',
        'email'
      ]
    } );

    return new Request( this._applyConfig( {
      method: 'GET',
      uri: `/users/${ info.userId }?${ qs.stringify( { fields: info.fields.join( ',' ) } ) }`,
      maxNumRepeats: 0
    } ) ).send();
  }

  /**
   * Debit amount from account
   * @access public
   * @param {Object} info
   * @param {string} info.userId
   * @param {string} info.sessionId
   * @param {string} info.roundId
   * @param {string} info.amount
   * @param {string} info.gameType
   * @param {string} [info.transactionId]
   */
  debit( info ) {
    let transactionId = info.transactionId || uuid();
    return new Request( this._applyConfig( {
      method: 'PUT',
      uri: `/users/${ info.userId }` +
        ( info.roundId ? `/rounds/${ info.roundId }` : ''  ) +
        `/transactions/${ transactionId }?` +
        `${ qs.stringify( { type: 'DEBIT', sessionId: info.sessionId } ) }`,
      body: _.omit( info, [
        'userId',
        'sessionId',
        'roundId',
        'transactionId'
      ] ),
      maxNumRepeats: 5
    } ) ).send();
  }

  /**
   * Cancel debit amount from account
   * @access public
   * @param {Object} info
   * @param {string} info.userId
   * @param {string} info.sessionId
   * @param {string} info.roundId
   * @param {string} info.debitTransactionId
   * @param {string} info.gameType
   * @param {string} [info.transactionId]
   */
  cancelDebit( info ) {
    let transactionId = info.transactionId || uuid();
    return new Request( this._applyConfig( {
      method: 'PUT',
      uri: `/users/${ info.userId }` +
         ( info.roundId ? `/rounds/${ info.roundId }` : ''  ) +
        `/transactions/${ transactionId }?` +
        `${ qs.stringify( { type: 'CANCEL_DEBIT', sessionId: info.sessionId } ) }`,
      body: _.omit( info, [
        'userId',
        'sessionId',
        'roundId',
        'transactionId'
      ] ),
      maxNumRepeats: 5
    } ) ).send();
  }

  /**
   * End round amount from account
   * @access public
   * @param {Object} info
   * @param {string} info.userId
   * @param {string} info.sessionId
   * @param {string} info.roundId
   * @param {string} info.gameType
   */
  endRound( info ) {
    return new Request( this._applyConfig( {
      method: 'POST',
      uri: `/users/${ info.userId }/rounds/${ info.roundId }/end?` +
        `${ qs.stringify( { sessionId: info.sessionId } ) }`,
      body: _.omit( info, [
        'userId',
        'sessionId',
        'roundId'
      ] ),
      maxNumRepeats: 0
    } ) ).send();
  }

  /**
   * Credit amount into account
   * @access public
   * @param {Object} info
   * @param {string} info.userId
   * @param {string} info.sessionId
   * @param {string} info.roundId
   * @param {string} info.amount
   * @param {string} info.gameType
   * @param {string} [info.transactionId]
   */
  credit( info ) {
    let transactionId = info.transactionId || uuid();
    return new Request( this._applyConfig( {
      method: 'PUT',
      uri: `/users/${ info.userId }` +
         ( info.roundId ? `/rounds/${ info.roundId }` : ''  ) +
        `/transactions/${ transactionId }?` +
        `${ qs.stringify( { type: 'CREDIT', sessionId: info.sessionId } ) }`,
      body: _.omit( info, [
        'userId',
        'sessionId',
        'roundId',
        'transactionId'
      ] ),
      maxNumRepeats: 5
    } ) ).send();
  }
  /**
   * Place bet
   * @access public
   * @param {Object} info
   * @param {string} info.userId
   * @param {string} info.sessionId
   * @param {string} info.referenceId
   * @param {string} info.betAmount
   * @param {string} [info.transactionId]
   */
  bet( info ) {
    let transactionId = info.transactionId || uuid();
    return new Request( this._applyConfig( {
      method: 'PUT',
      uri: `/users/${ info.userId }/transactions/${ transactionId }?` +
        `${ qs.stringify( { type: 'BET', sessionId: info.sessionId, referenceId: info.referenceId } ) }`,
      body: _.omit( info, [
        'userId',
        'sessionId',
        'referenceId',
        'transactionId'
      ] ),
      maxNumRepeats: 2
    } ) ).send();
  }

  /**
   * Place bet
   * @access public
   * @param {Object} info
   * @param {string} info.userId
   * @param {string} info.sessionId
   * @param {string} info.referenceId
   * @param {string} info.winloss
   * @param {string} [info.transactionId]
   */
  result( info ) {
    let transactionId = info.transactionId || uuid();
    return new Request( this._applyConfig( {
      method: 'PUT',
      uri: `/users/${ info.userId }/transactions/${ transactionId }?` +
        `${ qs.stringify( { type: 'RESULT', sessionId: info.sessionId, referenceId: info.referenceId } ) }`,
      body: _.omit( info, [
        'userId',
        'sessionId',
        'referenceId',
        'transactionId'
      ] ),
      maxNumRepeats: 2
    } ) ).send();
  }

  /**
   * Place bet
   * @access public
   * @param {Object} info
   * @param {string} info.userId
   * @param {string} info.sessionId
   * @param {string} info.referenceId
   * @param {string} [info.transactionId]
   */
  cancel( info ) {
    let transactionId = info.transactionId || uuid();
    return new Request( this._applyConfig( {
      method: 'PUT',
      uri: `/users/${ info.userId }/transactions/${ transactionId }?` +
        `${ qs.stringify( { type: 'CANCEL', sessionId: info.sessionId, referenceId: info.referenceId } ) }`,
      body: _.omit( info, [
        'userId',
        'sessionId',
        'referenceId',
        'transactionId'
      ] ),
      maxNumRepeats: 2
    } ) ).send();
  }
}
