'use strict';
var inherits = require('inherits');
var HttpRequestEvent = require('./HttpRequestEvent');

function HttpResponseEvent(request, response, attributes) {
    this._response = response;
    HttpRequestEvent.call(this, 'HttpResponse', request, attributes);
}
inherits(HttpResponseEvent, HttpRequestEvent);
var proto = HttpResponseEvent.prototype;

proto.getResponse = function() {
    return this._response;
};

proto.setResponse = function(response) {
    this._response = response;
    return this;
};

module.exports = HttpResponseEvent;