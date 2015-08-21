'use strict';
var inherits = require('inherits');
var Message = require('./Message');

function Request(method, url, contents, headers) {
  Message.call(this, contents, headers);
  this._url = url;
  this.setMethod(method);
}

inherits(Request, Message);
var proto = Request.prototype;

proto.getMethod = function() {
  return this._method;
};

proto.setMethod = function(method) {
  this._method = method.toUpperCase();
  return this;
};

proto.getUrl = function() {
  return this._url;
};

proto.setUrl = function(url) {
  this._url = url;
  return this;
};

proto.setHttp = function(http) {
  this._http = http;
  return this;
};

proto.send = function() {
  if (!this._http) {
    throw new Error(
      'Cannot send a detached request. Use Request.setHttp, Http.request, or Http.send.'
      );
  }

  return this._http.send(this);
};

module.exports = Request;
