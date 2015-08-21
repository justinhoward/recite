'use strict';
var Hoopla = require('hoopla');
var Request = require('./messages/Request');
var Response = require('./messages/Response');
var HttpRequestEvent = require('./events/HttpRequestEvent');
var HttpResponseEvent = require('./events/HttpResponseEvent');
var encodeAttributes = require('./utilities/encodeAttributes');
var isPlainObject = require('./utilities/isPlainObject');
var isEmptyObject = require('./utilities/isEmptyObject');

/**
 * The Http client. Creates and sends requests.
 *
 * @class Http
 * @param {Object} driver Must implement `send(request, callback)`
 * @param {Hoopla} [dispatcher] Overrides the default event dispatcher
 */
function Http(driver, dispatcher) {
  if (!dispatcher) {
    dispatcher = new Hoopla();
  }

  this._driver = driver;
  this._dispatcher = dispatcher;
}

var proto = Http.prototype;

/**
 * Create a request object
 *
 * @method request
 * @memberof Http.prototype
 * @param {string} method The HTTP method (GET, POST, etc.)
 * @param {string} url The request url
 * @param {*} [contents] The request body
 * @param {Headers|Object} [headers] Request headers
 * @return {Request} The new Request object
 */
proto.request = function(method, url, contents, headers) {
  var request = new Request(method, url, contents, headers);
  request.setHttp(this);
  return request;
};

/**
 * Creates a GET request, optionally with encoded attributes
 *
 * @method get
 * @memberof Http.prototype
 * @see {@link Http#request}
 * @param {string} url The request url
 * @param {Object} [attributes] Attributes to be converted to GET parameters
 * @param {Headers|Object} [headers] Request headers
 * @return {request} The new GET Request object
 */
proto.get = function(url, attributes, headers) {
  if (isPlainObject(attributes) && !isEmptyObject(attributes)) {
    url = url + '?' + encodeAttributes(attributes);
  }

  return this.request('GET', url, undefined, headers);
};

/**
 * Creates a POST request, a shortcut for `request('POST', ...)`
 *
 * @method post
 * @memberof Http.prototype
 * @see {@link Http#request}
 * @param {string} url The request url
 * @param {*} contents The request body
 * @param {Headers|Object} headers Request headers
 * @return {Request} The new POST Request object
 */
proto.post = function(url, contents, headers) {
  return this.request('POST', url, contents, headers);
};

/**
 * Sends a Request
 *
 * Sends a request instance to the driver. Returns a promise
 * that is resolved with a Response object. If the request
 * is unsuccessful, the promise is rejected with a Response object.
 *
 * Triggers `http.request` immediately, request handlers may modify
 * the `Request` object before it is sent.
 *
 * Triggers `http.response` when the driver returns the response.
 * Response handlers may modify the response before the promise is
 * resolved.
 *
 * @method send
 * @memberof Http.prototype
 * @param {Request} request The request to send
 * @return {Promise<Response, Response>} A Promise resolved or rejected with a Response object
 */
proto.send = function(request) {
  var self = this;
  request = dispatchRequest(self, request);
  return new Http.Promise(function(resolve, reject) {
    self._driver.send(request, function(response) {
      if (!(response instanceof Response)) {
        throw new Error('send callback must be called with a Response instance');
      }

      response = dispatchResponse(self, response);
      if (response.isSuccessful()) {
        resolve(response);
      } else {
        reject(response);
      }
    });
  });
};

/**
 * Gets the internal event dispatcher
 *
 * @method getDispatcher
 * @memberof Http.prototype
 * @alias module:http#getDispatcher
 * @return {Hoopla} The Hoopla event dispatcher
 */
proto.getDispatcher = function() {
  return this._dispatcher;
};

/**
 * Add an extension
 *
 * @method addExtension
 * @memberof Http.prototype
 * @alias module:http#addExtension
 * @param {Object} extension An extension implementing the `register(http)` function
 * @return [Http] `this`
 */
proto.addExtension = function(extension) {
  extension.register(this);
  return this;
};

function dispatchRequest(self, request) {
  var event = new HttpRequestEvent(request);
  self._dispatcher.dispatch(event);
  return event.getRequest();
}

function dispatchResponse(self, response) {
  var event = new HttpResponseEvent(response);
  self._dispatcher.dispatch(event);
  return event.getResponse();
}

module.exports = Http;
