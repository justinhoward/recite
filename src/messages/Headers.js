'use strict';

/**
 * A collection of HTTP headers
 *
 * Header names are always converted to lower case
 *
 * @class Http.Headers
 */
function Headers(headers) {
  this._headers = {};
  this.setObject(headers);
}

var proto = Headers.prototype;

/**
 * Gets the value of a header by name
 *
 * The search is case-insensitive. If no header is defined, will
 * return `undefined`.
 *
 * @memberof Http.Headers.prototype
 * @method get
 * @param {string} name The header name in any case
 * @return {string|undefined} The header contents if set, otherwise `undefined`
 */
proto.get = function(name) {
  return this._headers[name.toLowerCase()];
};

/**
 * Sets a header value
 *
 * @memberof Http.Headers.prototype
 * @method set
 * @param {string} name The header name
 * @param {string} contents The header value
 */
proto.set = function(name, contents) {
  this._headers[name.toLowerCase()] = contents;
};

/**
 * Returns all headers in a plain object.
 *
 * The return value is an object of key/value pairs
 * corresponding to header names/values. The keys are
 * always in lower case.
 *
 * @method all
 * @memberof Http.Headers.prototype
 * @return {Object} An object of the header names/values
 */
proto.all = function() {
  return this._headers;
};

/**
 * Removes all headers
 *
 * @method clear
 * @memberof Http.Headers.prototype
 */
proto.clear = function() {
  this._headers = {};
};

/**
 * Sets headers with a plain object.
 *
 * The object key/value pairs should correspond
 * to header names/values. They keys will be lower
 * cased. The given headers will be merged into
 * any existing headers. Conflicting keys
 * will be overwritten.
 *
 * @method setObject
 * @memberof Http.Headers.prototype
 * @param {Object} headers An object of the header names/values
 */
proto.setObject = function(headers) {
  for (var key in headers) {
    if (headers.hasOwnProperty(key)) {
      this.set(key, headers[key]);
    }
  }
};

module.exports = Headers;
