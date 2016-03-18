'use strict';

import nock       from 'nock';
import Request    from '../dist/lib/request';
import { expect } from 'chai';

describe( 'Request', function() {
  this.timeout( 10000 );

  it( 'should send request with Authorization header', function*() {
    let accessId = 'TEST',
      secretKey = '123456Seven',
      body = {
        userId: '1',
        username: 'zenoan',
        balance: 500
      };

    nock( 'https://api.as2bet.com', {
      reqheaders: {
        Authorization: new RegExp( `OW ${accessId}:.+` )
      }
    } )
      .get( '/users/1' )
      .reply( 200, body );

    let req = new Request( {
      baseUrl: 'https://api.as2bet.com',
      method: 'GET',
      uri: '/users/1',
      accessId,
      secretKey,
      maxNumRepeats: 0
    } );

    let res = yield req.send();

    expect( res ).to.deep.equal( body );
  } );

  it( 'should return error if statudeCode is not 200', function*() {
    let accessId = 'TEST',
      secretKey = '123456Seven';

    nock( 'https://api.as2bet.com' )
      .post( '/users/1/sessions' )
      .reply( 409, {
        code: 'ERR_INSUFFICIENT_BALANCE',
        message: 'Player 1 does not have balance'
      } );

    let req = new Request( {
      baseUrl: 'https://api.as2bet.com',
      method: 'POST',
      uri: '/users/1/sessions',
      accessId,
      secretKey,
      maxNumRepeats: 0
    } );

    try {
      yield req.send();
    } catch ( err ) {
      expect( err.code ).to.equal( 'ERR_INSUFFICIENT_BALANCE' );
    }
  } );

  it( 'should return error if request times out', function*() {
    let accessId = 'TEST',
      secretKey = '123456Seven';

    nock( 'https://api.as2bet.com' )
      .post( '/users/1/sessions' )
      .delay( 750 )
      .reply( 200 );

    let req = new Request( {
      baseUrl: 'https://api.as2bet.com',
      method: 'POST',
      uri: '/users/1/sessions',
      accessId,
      secretKey,
      maxNumRepeats: 0,
      timeout: 500
    } );

    try {
      yield req.send();
    } catch ( err ) {
      expect( err.code ).to.equal( 'ETIMEDOUT' );
    }

  } );

  it( 'should retry if request times out', function*() {
    let accessId = 'TEST',
      secretKey = '123456Seven';

    nock( 'https://api.as2bet.com' )
      .post( '/users/1/sessions' )
      .times( 3 )
      .delay( 750 )
      .reply( 200 );

    let req = new Request( {
      baseUrl: 'https://api.as2bet.com',
      method: 'POST',
      uri: '/users/1/sessions',
      accessId,
      secretKey,
      maxNumRepeats: 2,
      timeout: 500
    } );

    try {
      yield req.send();
    } catch ( err ) {
      expect( err.code ).to.equal( 'ETIMEDOUT' );
    }

  } );
} );
