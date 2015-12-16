'use strict';
var isPlainObject = require('../utilities/isPlainObject');

/**
 * Provides multipart form awareness to Http
 *
 * Registering this extension adds the `postForm`, and `requestForm`
 * methods. It also adds request and response listeners that watch
 * for `multipart/form-data` content types and encodes the content.
 *
 * @class Http.extensions.FormExtension
 */
function FormExtension() {}

FormExtension.FormData = global.FormData;

var proto = FormExtension.prototype;

/**
 * Register this extension
 *
 * Usually done via {@link Http#addExtension}
 *
 * @param {Http} http The Http instance to register to
 */
proto.register = function(http) {
  this.addListeners(http.getDispatcher());
  if (!http.postForm) {
    http.postForm = FormExtension.postForm;
  }

  if (!http.requestForm) {
    http.requestForm = FormExtension.requestForm;
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
  dispatcher.addListener('http.request', FormExtension.httpRequestListener);
};

/**
 * Creates an HTTP POST request with a `multipart/form-data` content type
 *
 * Sets the `Content-type` header to `multipart/form-data`
 * If `contents` is given, it will be form encoded.
 *
 * @method postForm
 * @memberof Http.extensions.FormExtension
 * @see {@link Http.extensions.FormExtension#requestJson}
 * @param {string} url The request URL
 * @param {*} contents The body contents
 * @param {Headers|Object} headers Additional request headers
 * @return {Http.Request} The request object
 */
FormExtension.postForm = function(url, contents, headers) {
  var request = this.post(url, contents, headers);
  return requestToForm(request);
};

/**
 * Creates an HTTP request with a `multipart/form-data` content type
 *
 * Sets the `Content-type` header to `multipart/form-data`
 * If `contents` is given, it will be form encoded.
 *
 * This method is added to the `Http` instance when the extension is registered.
 * Call it with
 *
 * ```
 * http.requestForm('PUT', 'http://example.com', {foo: 123});
 * ```
 *
 * @param {string} method The HTTP method
 * @param {string} url The request url
 * @param {*} contents The request body contents
 * @param {Headers|Object} [headers] Additional request headers
 * @return {Http.Request} The request object
 */
FormExtension.requestForm = function(method, url, contents, headers) {
  var request = this.request(method, url, contents, headers);
  return requestToForm(request);
};

/**
 * A request listener that automatically encodes the request body when the
 * `content-type` header is set to `multipart/form-data`
 *
 * Can be manually registered with
 *
 * ```
 * dispatcher.addListener('http.request', FormExtension.httpRequestListener);
 * ```
 * @method httpRequestListener
 * @memberof Http.extensions.FormExtension
 * @param {Hoopla.Event} event The `http.request` event object
 */
FormExtension.httpRequestListener = function(event) {
  var request = event.getRequest();
  if (request.getHeaders().getContentType() === 'multipart/form-data') {
    event.setRequest(toMultipart(request));
  }
};

function toMultipart(request) {
  var form = request.getContents();
  if (!(form instanceof FormExtension.FormData)) {
    form = new FormExtension.FormData();
    appendFormData(form, request);
  }

  if (form.getHeaders) {
    request.getHeaders().set('content-type', form.getHeaders()['content-type']);
  }
  return request;
}

function requestToForm(request) {
  var headers = request.getHeaders();
  headers.set('content-type', 'multipart/form-data');
  return request;
}

function appendFormData(form, request) {
  var contents = request.getContents();
  if (isPlainObject(contents)) {
    for (var key in contents) {
      if (contents.hasOwnProperty(key)) {
        form.append(key, contents[key]);
      }
    }
  }
  request.setContents(form);
  return request;
}

module.exports = FormExtension;
