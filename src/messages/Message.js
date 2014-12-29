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

proto.getHeaders = function() {
    return this._headers;
};

module.exports = Message;