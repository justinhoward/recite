'use strict';
var Hoopla = require('hoopla');
var Request = require('./messages/Request');
var HttpRequestEvent = require('./HttpRequestEvent');
var HttpResponseEvent = require('./HttpResponseEvent');

function Http(driver, dispatcher) {
    if (!dispatcher) {
        dispatcher = new Hoopla();
    }
    this._driver = driver;
    this._dispatcher = dispatcher;
}
var proto = Http.prototype;

proto.request = function(method, url, contents, headers) {
    var request = new Request(method, url, contents, headers);
    request.setHttp(this);
    return request;
};

proto.get = function(url, attributes, headers) {
    this.request('GET', url + '?' + this.encodeAttributes(attributes), headers);
};

proto.post = function(url, contents, headers) {
    return this.request('POST', url, contents, headers);
};

proto.postJson = function(url, contents, headers) {
    if (typeof contents !== 'string') {
        contents = JSON.stringify(contents);
    }
    var request = this.request(url, contents, headers);
    headers = request.getHeaders();
    headers.set('content-type', 'application/json');
    headers.set('accept', 'application/json');
    return request;
};

proto.send = function(request) {
    var self = this;
    request = dispatchRequest(self, request);
    return this._driver.send(request).then(function(response) {
        return dispatchResponse(self, request, response);
    }, function(response) {
        return Http.Promise.reject(dispatchResponse(self, request, response));
    });
};

proto.encodeAttributes = function(attributes) {
    var encoded = [], attr;
    for (attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
            encoded.push(encodeURIComponent(attr) + '=' + encodeURIComponent(attributes[attr]));
        }
    }
    return encoded.join('&');
};

function dispatchRequest(self, request) {
    var event = new HttpRequestEvent(request);
    self._dispatcher.dispatch(event);
    return event.getRequest();
}

function dispatchResponse(self, request, response) {
    var event = new HttpResponseEvent(request, response);
    self._dispatcher.dispatch(event);
    return event.getResponse();
}

module.exports = Http;