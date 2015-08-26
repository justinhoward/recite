'use strict';
var inherits = require('inherits');
var Event = require('hoopla/src/Event');
var Request = require('../messages/Request');

/**
 * Dispatched before a request is sent
 *
 * To modify the request, you can either directly modify
 * the attributes of the request, or use `setRequest` to
 * replace the request being sent.
 *
 * @class Http.events.HttpRequestEvent
 * @param {Http.Request} request The request being sent
 * @param {Object} [attributes] Extra event attributes
 */
function HttpRequestEvent(request, attributes) {
  Event.call(this, 'http.request', attributes);
  this.setRequest(request);
}

inherits(HttpRequestEvent, Event);
var proto = HttpRequestEvent.prototype;

/**
 * Get the request being sent
 *
 * @method getRequest
 * @memberof Http.events.HttpRequestEvent.prototype
 * @return {Http.Request} The request
 */
proto.getRequest = function() {
  return this._request;
};

/**
 * Set the request object to be sent
 *
 * @method setRequest
 * @memberof Http.events.HttpRequestEvent.prototype
 * @param {Http.Request} request The request to send
 * @return {Http.events.HttpRequestEvent} `this`
 */
proto.setRequest = function(request) {
  if (!(request instanceof Request)) {
    throw new Error('request must be a Request instance');
  }

  this._request = request;
  return this;
};

module.exports = HttpRequestEvent;
