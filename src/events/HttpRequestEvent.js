'use strict';
var inherits = require('inherits');
var Event = require('hoopla/src/Event');

function HttpRequestEvent(request, attributes) {
    this._request = request;
    Event.call(this, 'HttpRequest', attributes);
}
inherits(HttpRequestEvent, Event);
var proto = HttpRequestEvent.prototype;

proto.getRequest = function() {
    return this._request;
};

proto.setRequest = function(request) {
    this._request = request;
    return this;
};

module.exports = HttpRequestEvent;