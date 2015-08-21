'use strict';
var inherits = require('inherits');
var Event = require('hoopla/src/Event');
var Response = require('../messages/Response');

function HttpResponseEvent(response, attributes) {
  Event.call(this, 'http.response', attributes);
  this.setResponse(response);
}

inherits(HttpResponseEvent, Event);
var proto = HttpResponseEvent.prototype;

proto.getResponse = function() {
  return this._response;
};

proto.setResponse = function(response) {
  if (!(response instanceof Response)) {
    throw new Error('response must be a Response instance');
  }

  this._response = response;
  return this;
};

module.exports = HttpResponseEvent;
