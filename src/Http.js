'use strict';
var Hoopla = require('hoopla');
var Request = require('./messages/Request');
var Response = require('./messages/Response');
var HttpRequestEvent = require('./events/HttpRequestEvent');
var HttpResponseEvent = require('./events/HttpResponseEvent');
var encodeAttributes = require('./utilities/encodeAttributes');
var isEmptyObject = require('./utilities/isEmptyObject');

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
    if (!isEmptyObject(attributes)) {
        url = url + '?' + encodeAttributes(attributes);
    }

    return this.request('GET', url, null, headers);
};

proto.post = function(url, contents, headers) {
    return this.request('POST', url, contents, headers);
};

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

proto.getDispatcher = function() {
    return this._dispatcher;
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