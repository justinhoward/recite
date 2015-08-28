'use strict';

/**
 * Allows setting a URL prefix for all requests
 *
 * All requests will prepended with the given prefix.
 * For example, you may want to prefix all your requests
 * with your domain name.
 *
 *   http.addExtension(new UrlPrefixExtension('http://example.com'));
 *
 * Then if you request '/api/person', it your domain will be added to that URL.
 *
 *   http.get('/api/person').send();
 *   // sends to http://example.com/api/person
 *
 * @class Http.extensions.JsonExtension
 * @param {string} prefix The prefix to prepend to request URLs
 */
function UrlPrefixExtension(prefix) {
  this.prefix = prefix;
}

var proto = UrlPrefixExtension.prototype;

/**
 * Register this extension
 *
 * Usually done via {@link Http#addExtension}
 *
 * @param {Http} http The Http instance to register to
 */
proto.register = function(http) {
  this.addListeners(http.getDispatcher());
};

/**
 * Registers the event listeners with a dispatcher
 *
 * This is automatically done when registering the extension
 *
 * @param {Hoopla} dispatcher The `Hoopla` dispatcher instance
 */
proto.addListeners = function(dispatcher) {
  var self = this;
  dispatcher.addListener('http.request', function(event) {
    var request = event.getRequest();
    request.setUrl(self.prefix + request.getUrl());
  });
};

module.exports = UrlPrefixExtension;
