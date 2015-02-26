'use strict';
var Http = require('./src/Http');

Http.Promise = global.Promise;

Http.Message = require('./src/messages/Message');
Http.Request = require('./src/messages/Request');
Http.Response = require('./src/messages/Response');
Http.Headers = require('./src/messages/Headers');

Http.driver = {
    XmlHttpRequestDriver: require('./src/drivers/XmlHttpRequestDriver'),
    NodeDriver: require('./src/drivers/NodeDriver')
};

Http.event = {
    HttpRequestEvent: require('./src/events/HttpRequestEvent'),
    HttpResponseEvent: require('./src/events/HttpResponseEvent')
};

Http.extensions = {
    JsonExtension: require('./src/extensions/JsonExtension')
};

Http.utils = {
    encodeAttributes: require('./src/utilities/encodeAttributes'),
    isEmptyObject: require('./src/utilities/isEmptyObject'),
    isPlainObject: require('./src/utilities/isPlainObject')
};

module.exports = Http;
