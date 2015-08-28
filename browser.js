'use strict';
var Http = require('./src/Http');

Http.Promise = global.Promise;

Http.Message = require('./src/messages/Message');
Http.Request = require('./src/messages/Request');
Http.Response = require('./src/messages/Response');
Http.Headers = require('./src/messages/Headers');

/**
 * Built-in drivers
 *
 * @type {Object}
 * @namespace Http.driver
 */
Http.drivers = {
  XmlHttpRequestDriver: require('./src/drivers/XmlHttpRequestDriver')
};

/**
 * Http event classes
 *
 * @type {Object}
 * @namespace Http.event
 */
Http.events = {
  HttpRequestEvent: require('./src/events/HttpRequestEvent'),
  HttpResponseEvent: require('./src/events/HttpResponseEvent')
};

/**
 * Built-in extensions
 *
 * @type {Object}
 * @namespace Http.extensions
 */
Http.extensions = {
  JsonExtension: require('./src/extensions/JsonExtension')
};

/**
 * Miscellaneous utilities
 *
 * @type {Object}
 * @namespace Http.utils
 */
Http.utils = {
  encodeAttributes: require('./src/utilities/encodeAttributes'),
  isEmptyObject: require('./src/utilities/isEmptyObject'),
  isPlainObject: require('./src/utilities/isPlainObject')
};

Http.getDefaultDriver = function() {
  return new Http.drivers.XmlHttpRequestDriver();
};

module.exports = Http;
