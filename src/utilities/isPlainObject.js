'use strict';

/**
 * Checks if a value is a plain javascript object.
 *
 * Plain objects are objects created with object literal
 * notation or with `new Object()`.
 *
 * @method isPlainObject
 * @memberof Http.utils
 * @param {*} value The value to check
 * @return {boolean} `true` if `value` is a plain object
 */
module.exports = function(value) {
  return '' + value === '[object Object]' && value.constructor === Object;
};
