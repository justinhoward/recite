'use strict';
var isPlainObject = require('./isPlainObject');

/**
 * Checks if a value is a plain object with no keys
 *
 * Must be a plain javascript object and have none
 * of its "own" properties. Ownership checking is done
 * with `hasOwnProperty`.
 *
 * @method isEmptyObject
 * @memberof Http.utils
 * @param {*} value The value to check
 * @return {boolean} `true` if `value` is an empty object
 */
module.exports = function(value) {
  if (!isPlainObject(value)) {
    return false;
  }

  for (var key in value) {
    if (value.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
};
