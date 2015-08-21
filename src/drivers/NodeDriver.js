'use strict';
var Response = require('../messages/Response');
var http = require('http');
var https = require('https');
var url = require('url');

function NodeDriver() {}

var proto = NodeDriver.prototype;

proto.send = function(request, callback) {
  var urlParts = url.parse(request.getUrl());
  var options = this.getRequestOptions(request, urlParts);
  var library = urlParts.protocol === 'https:' ? https : http;

  this.request(library, request, options, callback);
};

proto.getRequestOptions = function(request, urlParts)
{
  var options = {
    hostname: urlParts.hostname,
    path: urlParts.path,
    headers: request.getHeaders().all(),
    method: request.getMethod()
  };

  if (urlParts.port) {
    options.port = urlParts.port;
  }

  return options;
};

proto.createResponse = function(request, nodeResponse, contents) {
  return new Response(
    request,
    nodeResponse.statusCode,
    contents,
    nodeResponse.headers
    );
};

proto.request = function(library, request, options, callback)
{
  var self = this;
  var nodeRequest = library.request(options, function(nodeResponse) {
    var contents = '';
    nodeResponse.setEncoding('utf8');
    nodeResponse.on('data', function(chunk) {
      contents += chunk;
    });

    nodeResponse.on('end', function() {
      callback(self.createResponse(request, nodeResponse, contents));
    });
  });

  nodeRequest.on('error', function(error) {
    self.handleError(request, error, callback);
  });

  var contents = request.getContents();
  if (typeof contents !== 'undefined' && contents !== null) {
    nodeRequest.write(contents);
  }

  nodeRequest.end();
};

proto.handleError = function(request, error, callback)
{
  if (error.code === 'ENOTFOUND') {
    callback(new Response(request, 404));
  } else {
    throw new Error('Error sending http request: ' + error);
  }
};

module.exports = NodeDriver;
