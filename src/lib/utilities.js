'use strict';

import crypto  from 'crypto';
import Promise from 'bluebird';

/**
 * Generates hmac given a string and key
 * @param  {string} message
 * @param  {string} key
 * @return {string}
 */
export function hmac ( message, key ) {
  return crypto.createHmac( 'sha1', key ).update( message ).digest( 'base64' );
}

/**
 * Generates hash given a string
 * @param  {string} message
 * @param  {string} key
 * @return {string}
 */
export function hash ( message ) {
  return crypto.createHash( 'sha1' ).update( message ).digest( 'base64' );
}

/**
 * Generate a UUID
 * @return {string}
 */
export function uuid () {
  return require( 'node-uuid' ).v1();
}

export class Backoff {

  constructor( initialDelay ) {
    this.count = 0;
    this.previousDelay = 0;
    this.currentDelay = initialDelay;
  }

  backoff() {
    return new Promise( resolve => {
      setTimeout( () => {
        let prev = this.previousDelay;
        this.previousDelay = this.currentDelay;
        this.currentDelay += prev;
        this.count++;
        resolve();
      }, this.currentDelay );
    } );
  }
}
