'use strict';
var Http = require('../Http');
var Response = require('../messages/Response');

function XmlHTTPRequestDriver(Xhr) {
    this.Xhr = Xhr;
}
var proto = XmlHTTPRequestDriver.prototype;

proto.send = function(request) {
    return Http.Promise.reject(new Response(request, 404));
};

module.exports = XmlHTTPRequestDriver;