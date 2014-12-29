'use strict';
var Headers = require('./Headers');

function Message(contents, headers) {
    if (!(headers instanceof Headers)) {
        headers = new Headers(headers);
    }

    this._contents = contents;
    this._headers = headers;
}
var proto = Message.prototype;

proto.getContents = function() {
    return this._contents;
};

proto.setContents = function(contents) {
    this._contents = contents;
    return this;
};

proto.getHeaders = function() {
    return this._headers;
};

proto.setHeaders = function(headers) {
    this._headers = headers;
    return this;
};

module.exports = Message;