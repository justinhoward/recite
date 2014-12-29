'use strict';
var inherits = require('inherits');
var Message = require('./Message');

function Request(url, contents, headers) {
    Message.call(this, contents, headers);
    this._url = url;
}
inherits(Request, Message);
var proto = Request.prototype;

proto.getUrl = function() {
    return this._url;
};

proto.setHttp = function(http) {
    this._http = http;
    return this;
};

proto.send = function() {
    if (!this._http) {
        throw new Error(
            'Cannot send a detached request. Use the setHttp method or a Http request method.'
        );
    }

    return this._http.send(this);
};

module.exports = Request;