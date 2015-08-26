'use strict';
var Response = require('../messages/Response');
var Headers = require('../messages/Headers');

/**
 * Driver for the browser `XMLHttpRequest` API
 *
 * Use this driver when in a browser environment.
 *
 * By default, this driver uses the global `XMLHttpRequest` function
 * to send requests. To override this, use the `xhrFactory` parameter
 * to construct your own XMLHttpRequest. The callback should return
 * a new instance each time it is called.
 *
 * @class Http.drivers.XmlHttpRequestDriver
 * @param {Function} [xhrFactory] A function that returns a new `XMLHttpRequest` instance
 */
function XmlHttpRequestDriver(xhrFactory) {
  if (!xhrFactory) {
    xhrFactory = function() {
      return new global.XMLHttpRequest();
    };
  }

  this.xhrFactory = xhrFactory;
}

var proto = XmlHttpRequestDriver.prototype;

proto.send = function(request, callback) {
  var self = this;
  var xhr = this.xhrFactory();
  xhr.open(request.getMethod(), request.getUrl());
  this.setRequestHeaders(xhr, request);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(self.getXhrResponse(xhr, request));
    }
  };

  xhr.send(request.getContents());
};

proto.getXhrResponse = function(xhr, request) {
  return new Response(
    request,
    xhr.status,
    xhr.response,
    this.getXhrHeaders(xhr)
  );
};

proto.setRequestHeaders = function(xhr, request) {
  var headerObject = request.getHeaders().all();
  for (var key in headerObject) {
    if (headerObject.hasOwnProperty(key)) {
      xhr.setRequestHeader(key, headerObject[key]);
    }
  }
};

proto.getXhrHeaders = function(xhr) {
  var resultHeaders = new Headers();
  var rawHeaders = xhr.getAllResponseHeaders().split('\n');
  var regEx = /^([^\s:][^:]*):/;
  var i = 0;
  var iLen = rawHeaders.length;
  for (; i < iLen; i++) {
    var matches = rawHeaders[i].match(regEx);
    if (matches) {
      resultHeaders.set(matches[1], xhr.getResponseHeader(matches[1]));
    }
  }

  return resultHeaders;
};

module.exports = XmlHttpRequestDriver;
