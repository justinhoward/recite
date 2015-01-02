'use strict';
var Response = require('../messages/Response');

function XmlHTTPRequestDriver(Xhr) {
    if (!Xhr) {
        Xhr = global.XMLHTTPRequest;
    }

    this.Xhr = Xhr;
}
var proto = XmlHTTPRequestDriver.prototype;

proto.send = function(request, callback) {
    return callback(new Response(request, 404));
};

module.exports = XmlHTTPRequestDriver;