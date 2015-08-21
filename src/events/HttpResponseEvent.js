'use strict';
var inherits = require('inherits');
var Event = require('hoopla/src/Event');
var Response = require('../messages/Response');

/**
 * Dispatched before a response is returned
 *
 * To modify the response, you can either directly modify
 * the attributes of the response, or use `setResponse` to
 * replace the response being returned.
 *
 * @class Http.event.HttpResponseEvent
 * @param {Http.Response} response The response being returned
 * @param {Object} [attributes] Extra event attributes
 */
function HttpResponseEvent(response, attributes) {
  Event.call(this, 'http.response', attributes);
  this.setResponse(response);
}

inherits(HttpResponseEvent, Event);
var proto = HttpResponseEvent.prototype;

/**
 * Get the response being returned
 *
 * @method getResponse
 * @memberof Http.event.HttpResponseEvent.prototype
 * @return {Http.Response} The response
 */
proto.getResponse = function() {
  return this._response;
};

/**
 * Set the response to return
 *
 * @method setResponse
 * @memberof Http.event.HttpResponseEvent.prototype
 * @param {Http.Response} response The response
 * @return {Http.event.HttpResponseEvent} `this`
 */
proto.setResponse = function(response) {
  if (!(response instanceof Response)) {
    throw new Error('response must be a Response instance');
  }

  this._response = response;
  return this;
};

module.exports = HttpResponseEvent;
