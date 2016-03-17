'use strict';

import {
  hmac,
  hash,
  uuid,
  Backoff
} from '../dist/lib/utilities';

import { expect } from 'chai';
import _          from 'lodash';

describe( 'Utilities', function() {

  describe( '#hmac()', function() {
    it( 'should generate hmac', function() {
      let result1 = hmac( 'hello world', '1234' );
      let result2 = hmac( 'hello world', '12345' );

      expect( result1 ).to.not.equal( result2 );
    } );
  } );

  describe( '#hash()', function() {
    it( 'should generate hash', function() {
      let result1 = hash( 'hello world' );
      let result2 = hash( 'hello world!' );

      expect( result1 ).to.not.equal( result2 );
    } );
  } );

  describe( '#uuid()', function() {
    it( 'should generate uuid', function() {
      let taken = new Set();
      let count = 10000;
      _.times( count, () => {
        let id = uuid();
        expect( taken.has( id ) ).to.not.be.ok; // jshint ignore:line
        taken.add( id );
      } );

      expect( taken.size ).to.equal( count );
    } );
  } );

  describe( '#Backoff.backoff()', function() {
    this.timeout( 15000 );

    it( 'should progressively increase timeout time', function*() {
      let delay = new Backoff( 100 );
      let timestamp;

      let expectedDelays = [
        100,
        100,
        200,
        300,
        500,
        800,
        1300
      ];

      for ( let expectedDelay of expectedDelays ) {
        timestamp = Date.now();
        yield delay.backoff();
        expect( Date.now() - timestamp ).to.be.within( expectedDelay - 50, expectedDelay + 50 );
      }
    } );

  } );

} );
