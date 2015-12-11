'use strict';
var isPlainObject = require('../utilities/isPlainObject');

/**
 * Provides JSON awareness to Http
 *
 * Registering this extension adds the `getJson`, and `setJson`
 * methods. It also adds request and response listeners that watch
 * for `application/json` content types and encode/decode JSON
 * content bodies.
 *
 * @class Http.extensions.JsonExtension
 */
function JsonExtension() {}

var proto = JsonExtension.prototype;

/**
 * Register this extension
 *
 * Usually done via {@link Http#addExtension}
 *
 * @param {Http} http The Http instance to register to
 */
proto.register = function(http) {
  this.addListeners(http.getDispatcher());
  if (!http.getJson) {
    http.getJson = JsonExtension.getJson;
  }

  if (!http.postJson) {
    http.postJson = JsonExtension.postJson;
  }

  if (!http.requestJson) {
    http.requestJson = JsonExtension.requestJson;
  }
};

/**
 * Registers the event listeners with a dispatcher
 *
 * This is automatically done when registering the extension
 *
 * @param {Hoopla} dispatcher The `Hoopla` dispatcher instance
 */
proto.addListeners = function(dispatcher) {
  dispatcher.addListener('http.request', JsonExtension.httpRequestListener);
  dispatcher.addListener('http.response', JsonExtension.httpResponseListener);
};

/**
 * Creates an HTTP GET request with JSON headers
 *
 * Sets the `Content-type` header to `application/json`
 *
 * @method getJson
 * @memberof Http.extensions.JsonExtension
 * @see {@link Http.extensions.JsonExtension#requestJson}
 * @param {string} url The request URL
 * @param {Object} attributes Get parameters as an object of keys/values
 * @param {Headers|Object} headers Additional request headers
 * @return {Http.Request} The request object
 */
JsonExtension.getJson = function(url, attributes, headers) {
  var request = this.get(url, attributes, headers);
  return requestToJson(request);
};

/**
 * Creates an HTTP POST request with JSON headers
 *
 * Sets the `Content-type` header to `application/json`
 * If `contents` is given, it will be JSON stringified.
 *
 * @method postJson
 * @memberof Http.extensions.JsonExtension
 * @see {@link Http.extensions.JsonExtension#requestJson}
 * @param {string} url The request URL
 * @param {*} contents The body contents
 * @param {Headers|Object} headers Additional request headers
 * @return {Http.Request} The request object
 */
JsonExtension.postJson = function(url, contents, headers) {
  var request = this.post(url, contents, headers);
  return requestToJson(request);
};

/**
 * Creates an HTTP request with JSON headers
 *
 * Sets the `Content-type` header to `application/json`
 * If `contents` is given, it will be JSON stringified.
 *
 * This method is added to the `Http` instance when the extension is registered.
 * Call it with
 *
 * ```
 * http.requestJson('PUT', 'http://example.com', {foo: 123});
 * ```
 *
 * @param {string} method The HTTP method
 * @param {string} url The request url
 * @param {*} contents The request body contents
 * @param {Headers|Object} [headers] Additional request headers
 * @return {Http.Request} The request object
 */
JsonExtension.requestJson = function(method, url, contents, headers) {
  var request = this.request(method, url, contents, headers);
  return requestToJson(request);
};

/**
 * A request listener that automatically encodes
 * the request body as JSON when the `content-type` header
 * is set to `application/json`
 *
 * Can be manually registered with
 *
 * ```
 * dispatcher.addListener('http.request', JsonExtension.httpRequestListener);
 * ```
 * @method httpRequestListener
 * @memberof Http.extensions.JsonExtension
 * @param {Hoopla.Event} event The `http.request` event object
 */
JsonExtension.httpRequestListener = function(event) {
  var request = event.getRequest();
  if (request.getHeaders().getContentType() === 'application/json') {
    var contents = request.getContents();
    if (isPlainObject(contents)) {
      request.setContents(JSON.stringify(contents));
    }
  }
};

/**
 * A response listener that automatically encodes
 * the response body as JSON when the `content-type` header
 * is set to `application/json`
 *
 * Can be manually registered with
 *
 * ```
 * dispatcher.addListener('http.response', JsonExtension.httpResponseListener);
 * ```
 *
 * @method httpResponseListener
 * @memberof Http.extensions.JsonExtension
 * @param {Hoopla.Event} event The `http.request` event object
 */
JsonExtension.httpResponseListener = function(event) {
  var response = event.getResponse();
  if (response.getHeaders().getContentType() === 'application/json') {
    var contents = response.getContents();
    if (typeof contents === 'string') {
      response.setContents(JSON.parse(contents));
    }
  }
};

function requestToJson(request) {
  var headers = request.getHeaders();
  headers.set('content-type', 'application/json');
  headers.set('accept', 'application/json');
  return request;
}

module.exports = JsonExtension;
