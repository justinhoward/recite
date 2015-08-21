'use strict';
var inherits = require('inherits');
var Message = require('./Message');

/**
 * An HTTP response
 *
 * @class Http.Response
 * @extends Http.Method
 * @param {Http.Request} request The Request associated with this response
 * @param {number} status The response status code (200, 404, etc.)
 * @param {*} contents The response body contents
 * @param {Headers|Object} headers The response headers
 */
function Response(request, status, contents, headers) {
  Message.call(this, contents, headers);
  this.setStatus(status);
  this._request = request;
}

inherits(Response, Message);
var proto = Response.prototype;

/**
 * Get the request object associated with this response
 *
 * @method getRequest
 * @memberof Http.Response.prototype
 * @return {Request} The request object
 */
proto.getRequest = function() {
  return this._request;
};

/**
 * Get the response status code
 *
 * @method getStatus
 * @memberof Http.Response.prototype
 * @return {number} The status code
 */
proto.getStatus = function() {
  return this._status;
};

/**
 * Set the response status code
 *
 * @method setStatus
 * @memberof Http.Response.prototype
 * @param {number} status The status code
 * @return {Http.Response} `this`
 */
proto.setStatus = function(status) {
  this._status = status >> 0;
  return this;
};

/**
 * Checks if the response was successful
 *
 * The response is determined successful if its
 * status code is between 200 and 299.
 *
 * @method isSuccessful
 * @memberof Http.Response.prototype
 * @return {boolean} `true` if the response is successful
 */
proto.isSuccessful = function() {
  return this._status >= 200 && this._status < 300;
};

module.exports = Response;
