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
  this._index = {};
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
  return this._headers[this._index[name.toLowerCase()]];
};

/**
 * Sets a header value
 *
 * Setting a header that already exists will overwrite the
 * existing value. This is true even if the header is
 * in a different case (Content-Type vs. content-type).
 *
 * @memberof Http.Headers.prototype
 * @method set
 * @param {string} name The header name
 * @param {string} contents The header value
 * @return {Http.Headers} `this`
 */
proto.set = function(name, contents) {
  this.remove(name);
  this._index[name.toLowerCase()] = name;
  this._headers[name] = contents;
  return this;
};

/**
 * Removes a header
 *
 * The name is case insensitive, so removing 'Content-Type'
 * will also remove 'content-type'
 *
 * @param {string} name The header name to remove
 * @return {Http.Headers} `this`
 */
proto.remove = function(name) {
  name = name.toLowerCase();
  delete this._headers[this._index[name]];
  delete this._index[name];
  return this;
};

/**
 * Returns all headers in a plain object.
 *
 * The return value is an object of key/value pairs
 * corresponding to header names/values. The keys are
 * in the same case they were given.
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
 * @return {Http.Headers} `this`
 */
proto.clear = function() {
  this._headers = {};
  return this;
};

/**
 * Sets headers with a plain object.
 *
 * The object key/value pairs should correspond
 * to header names/values. They keys case will be maintained.
 * The given headers will be merged into
 * any existing headers. Conflicting keys
 * will be overwritten.
 *
 * @method setObject
 * @memberof Http.Headers.prototype
 * @param {Object} headers An object of the header names/values
 * @return {Http.Headers} `this`
 */
proto.setObject = function(headers) {
  for (var key in headers) {
    if (headers.hasOwnProperty(key)) {
      this.set(key, headers[key]);
    }
  }

  return this;
};

/**
 * Get the content type of the message.
 *
 * The content-type header can contain multiple parameters,
 * this returns only the mime-type parameter of the header.
 *
 * @method getContentType
 * @memberof Http.Headers.prototype
 * @return {string} The content type of the message
 */
proto.getContentType = function() {
  var header = this.get('content-type');
  if (!header) {
    return;
  }

  return header.split(';')[0];
};

module.exports = Headers;
