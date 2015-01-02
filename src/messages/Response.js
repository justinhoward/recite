'use strict';
var inherits = require('inherits');
var Message = require('./Message');

function Response(request, status, contents, headers) {
    Message.call(this, contents, headers);
    this.setStatus(status);
    this._request = request;
}
inherits(Response, Message);
var proto = Response.prototype;

proto.getRequest = function() {
    return this._request;
};

proto.getStatus = function() {
    return this._status;
};

proto.setStatus = function(status) {
    this._status = status >> 0;
    return this;
};

proto.isSuccessful = function() {
    return this._status >= 200 && this._status < 300;
};

module.exports = Response;