'use strict';

function Headers(headers) {
    this._headers = {};
    this.setObject(headers);
}
var proto = Headers.prototype;

proto.get = function(name) {
    return this._headers[name];
};

proto.set = function(name, contents) {
    this._headers[name.toLowerCase()] = contents;
};

proto.all = function() {
    return this._headers;
};

proto.clear = function() {
    this._headers = {};
};

proto.setObject = function(headers) {
    for (var key in headers) {
        if (headers.hasOwnProperty(key)) {
            this.set(key, headers[key]);
        }
    }
};

module.exports = Headers;