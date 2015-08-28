'use strict';
var inherits = require('inherits');
var Message = require('./Message');

/**
 * An HTTP request with a given method/url
 *
 * If a `Request` is constructed via the Http class,
 * `setHttp` will automatically be called, to enable constructs like
 *
 * ```
 * http.get('http://example.com').send();
 * ```
 *
 * If a `Request` is constructed manually, you need to call `setHttp`
 * yourself to enable the {@link Http.Request#send} method.
 *
 * ```
 * var http = new Http(driver);
 * var request = new Request('GET', 'http://example.com');
 *
 * // will throw an error
 * request.send();
 *
 * // you can send the request directly through your Http object
 * http.send(request);
 *
 * // or set http on your request before using `send`
 * request.setHttp(http);
 * request.send();
 * ```
 *
 * @class Http.Request
 * @extends Http.Method
 * @param {string} method The HTTP method to send (GET, POST, etc.)
 * @param {string} url The url to make a request to
 * @param {*} [contents] The body contents
 * @param {Headers|Object} [headers] The request headers
 */
function Request(method, url, contents, headers) {
  Message.call(this, contents, headers);
  this._url = url;
  this.setMethod(method);
}

inherits(Request, Message);
var proto = Request.prototype;

/**
 * Gets the HTTP method in upper case (GET, POST, etc.)
 *
 * @method getMethod
 * @memberof Http.Request.prototype
 * @return {string} The HTTP method
 */
proto.getMethod = function() {
  return this._method;
};

/**
 * Sets the HTTP method
 *
 * The method string will be converted to upper case
 *
 * @method setMethod
 * @memberof Http.Request.prototype
 * @param {string} method The HTTP method
 * @return {Request} `this`
 */
proto.setMethod = function(method) {
  this._method = method.toUpperCase();
  return this;
};

/**
 * Get the request URL
 *
 * @method getUrl
 * @memberof Http.Request.prototype
 * @return {string} The URL
 */
proto.getUrl = function() {
  return this._url;
};

/**
 * Set the request URL
 *
 * @method setUrl
 * @memberof Http.Request.prototype
 * @param {string} url The URL
 * @return {Http.Request} `this`
 */
proto.setUrl = function(url) {
  this._url = url;
  return this;
};

/**
 * Set the Http object associated with this request
 *
 * Setting the Http instance allows use of the {@link Http.Request#send} method
 *
 * @method setHttp
 * @memberof Http.Request.prototype
 * @param {Http} http The Http instance
 * @return {Http.Request} `this`
 */
proto.setHttp = function(http) {
  this._http = http;
  return this;
};

/**
 * Send this request
 *
 * Reqires the Http instance to be set via {@link Http.Request#setHttp}
 *
 * @method send
 * @memberof Http.Request.prototype
 * @see {@link Http#send}
 * @see {@link Http.Request}
 * @param {function(response)} onResolve A callback to be run on success
 * @param {function(response)} onReject A callback to be run on failure
 * @return {Promise<Response, Response>} A promise that resolves to a Response object
 */
proto.send = function(onResolve, onReject) {
  if (!this._http) {
    throw new Error(
      'Cannot send a detached request. Use Request.setHttp, Http.request, or Http.send.'
    );
  }

  return this._http.send(this, onResolve, onReject);
};

module.exports = Request;
