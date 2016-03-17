'use strict';

import {
  hmac,
  hash,
  uuid
} from '../dist/lib/utilities';

import { expect } from 'chai';
import _          from 'lodash';

describe( 'Utilities', function() {

  describe( '#hmac', function() {
    it( 'should generate hmac', function() {
      let result1 = hmac( 'hello world', '1234' );
      let result2 = hmac( 'hello world', '12345' );

      expect( result1 ).to.not.equal( result2 );
    } );
  } );

  describe( '#hash', function() {
    it( 'should generate hash', function() {
      let result1 = hash( 'hello world' );
      let result2 = hash( 'hello world!' );

      expect( result1 ).to.not.equal( result2 );
    } );
  } );

  describe( '#uuid', function() {
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

} );
