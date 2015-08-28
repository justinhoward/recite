'use strict';
var expect = require('chai').expect;
var Request = require('../../src/messages/Request');
var Response = require('../../src/messages/Response');
var Http = require('../../src/Http');

function OkDriver() {
  this.send = function(request, callback) {
    callback(new Response(request, 200));
  };
}

function NotFoundDriver() {
  this.send = function(request, callback) {
    callback(new Response(request, 404));
  };
}

describe('messages/Request', function() {
  it('can be constructed', function() {
    var request = new Request('GET', '/test', 'contents', {foo: 'val'});

    expect(request.getMethod()).to.equal('GET');
    expect(request.getUrl()).to.equal('/test');
    expect(request.getContents()).to.equal('contents');
    expect(request.getHeaders().get('foo')).to.equal('val');
  });

  it('converts method to upper case', function() {
    var request = new Request('get', '/test');

    // on construction
    expect(request.getMethod()).to.equal('GET');

    // and on set
    expect(request.getMethod()).to.equal('GET');
  });

  it('throws an error when sending a detached Request', function() {
    var request = new Request('get', '/test');
    expect(function() {
      request.send();
    }).to.throw();
  });

  it('can send itself if http is set', function() {
    var request = new Request('get', '/test');
    var http = new Http(new OkDriver());
    request.setHttp(http);
    return request.send().then(function(response) {
      expect(response.getRequest()).to.equal(request);
    });
  });

  it('calls the onResolve callback', function(done) {
    var request = new Request('get', '/test');
    var http = new Http(new OkDriver());
    request.setHttp(http);
    return request.send(function(response) {
      expect(response.getStatus()).to.equal(200);
      done();
    });
  });

  it('calls the onReject callback', function(done) {
    var request = new Request('get', '/test');
    var http = new Http(new NotFoundDriver());
    request.setHttp(http);
    return request.send(null, function(response) {
      expect(response.getStatus()).to.equal(404);
      done();
    });
  });
});
