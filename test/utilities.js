'use strict';

import { serializeObject } from '../dist/lib/utilities';
import { expect }          from 'chai';

describe( 'Utilities', function() {
  describe( '#serializeObject', function() {
    it( 'should return correct output when given number', function() {
      let input = 1000;

      let result = serializeObject( input );

      expect( result ).to.equal( '1000' );
    } );

    it( 'should return correct output when given boolean', function() {
      let input = true;

      let result = serializeObject( input );

      expect( result ).to.equal( 'true' );
    } );

    it( 'should return correct output when given string', function() {
      let input = 'hello world';

      let result = serializeObject( input );

      expect( result ).to.equal( 'hello world' );
    } );

    it( 'should return correct output when given a simple object', function() {
      let input = {
        one: 1,
        two: 2,
        three: 3,
        four: 4
      };

      let result = serializeObject( input );

      expect( result ).to.equal( 'four=4&one=1&three=3&two=2' );
    } );

    it( 'should return correct output when given an array', function() {
      let input = [
        1,
        2,
        { one: 1 }
      ];

      let result = serializeObject( input );

      expect( result ).to.equal( '1&2&one=1' );
    } );

    it( 'should return correct output when given a complex object', function() {
      let input = {
        number: 1,
        boolean: true,
        string: 'hello world!',
        object: {
          one: 1,
          two: 2,
          three: 3,
          four: 4
        },
        array: [
          1,
          2,
          { one: 1 }
        ]
      };

      let result = serializeObject( input );

      expect( result ).to.equal( 'array=1&2&one=1&boolean=true&number=1' +
        '&object=four=4&one=1&three=3&two=2&string=hello world!' );
    } );
  } );
} );
