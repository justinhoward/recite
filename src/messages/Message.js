'use strict';
var Headers = require('./Headers');

/**
 * The base class for Request and Response
 *
 * Has headers and body contents
 *
 * @class Http.Message
 * @param {*} [contents] The body contents
 * @param {Headers|Object} [headers] Message headers
 */
function Message(contents, headers) {
  this._contents = contents;
  this.setHeaders(headers);
}

var proto = Message.prototype;

/**
 * Get the message body contents
 *
 * @method getContents
 * @memberof Http.Message.prototype
 * @return {*} The message body
 */
proto.getContents = function() {
  return this._contents;
};

/**
 * Set the message body contents
 *
 * @method setContents
 * @memberof Http.Message.prototype
 * @param {*} contents The message body
 * @return {Http.Message} `this`
 */
proto.setContents = function(contents) {
  this._contents = contents;
  return this;
};

/**
 * Get the message headers
 *
 * @method getHeaders
 * @memberof Http.Message.prototype
 * @return {Headers} The headers
 */
proto.getHeaders = function() {
  return this._headers;
};

/**
 * Set the message headers
 *
 * @method setHeaders
 * @memberof Http.Message.prototype
 * @param {Headers|Object} headers The headers
 * @return {Http.Message} `this`
 */
proto.setHeaders = function(headers) {
  if (!(headers instanceof Headers)) {
    headers = new Headers(headers);
  }

  this._headers = headers;
  return this;
};

module.exports = Message;
