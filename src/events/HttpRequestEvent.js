'use strict';
var inherits = require('inherits');
var Event = require('hoopla/src/Event');
var Request = require('../messages/Request');

function HttpRequestEvent(request, attributes) {
    Event.call(this, 'http.request', attributes);
    this.setRequest(request);
}
inherits(HttpRequestEvent, Event);
var proto = HttpRequestEvent.prototype;

proto.getRequest = function() {
    return this._request;
};

proto.setRequest = function(request) {
    if (!(request instanceof Request)) {
        throw new Error('request must be a Request instance');
    }

    this._request = request;
    return this;
};

module.exports = HttpRequestEvent;