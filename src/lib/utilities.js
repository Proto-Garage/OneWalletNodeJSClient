'use strict';

import _ from 'lodash';

/**
 * Serializes object
 * @param  {object} obj
 * @return {string}
 */
export function serializeObject ( obj ) {
  if ( obj instanceof Array ) {
    return _.map( obj, ( item ) => {
      return serializeObject( item );
    } ).join( '&' );
  } else if ( obj instanceof Object ) {
    let result = [];
    _( obj ).keys().sortBy().each( ( key ) => {
      result.push( `${key}=${serializeObject( obj[ key ] )}` );
    } );
    return result.join( '&' );
  } else {
    return obj.toString();
  }
}
