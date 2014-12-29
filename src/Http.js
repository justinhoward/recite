'use strict';
var Hoopla = require('hoopla');
var Request = require('./messages/Request');
var HttpRequestEvent = require('./HttpRequestEvent');
var HttpResponseEvent = require('./HttpResponseEvent');
var encodeAttributes = require('./utility/encodeAttributes');

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
    return this.request('GET', url + '?' + encodeAttributes(attributes), headers);
};

proto.post = function(url, contents, headers) {
    return this.request('POST', url, contents, headers);
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

proto.getDispatcher = function() {
    return this._dispatcher;
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