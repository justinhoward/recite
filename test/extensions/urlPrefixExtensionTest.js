'use strict';
var expect = require('chai').expect;
var UrlPrefixExtension = require('../../src/extensions/UrlPrefixExtension');
var Http = require('../../src/Http');
var Response = require('../../src/messages/Response');

function OkDriver() {
  this.send = function(request, callback) {
    callback(new Response(request, 200));
  };
}

describe('extensions/UrlPrefixExtension', function() {
  it('adds a prefix to the request URL', function(done) {
    var http = new Http(new OkDriver());
    http.addExtension(new UrlPrefixExtension('http://example.com'));

    var request = http.get('/test');
    return http.send(request).then(function(response) {
      expect(response.getRequest().getUrl()).to.equal('http://example.com/test');
      done();
    });
  });
});
