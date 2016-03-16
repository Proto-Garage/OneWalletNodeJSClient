'use strict';

export class APIError extends Error {
  constructor( code, message ) {
    super( message );
    this.code = code;
  }

  get code() {
    return this.code;
  }
}
