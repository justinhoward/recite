'use strict';
var inherits = require('inherits');
var Message = require('./Message');

function Response(request, status, contents, headers) {
    Message.call(this, contents, headers);
    this._request = request;
    this._status = status;
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
    this._status = status;
    return this;
};

module.exports = Response;