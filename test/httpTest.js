'use strict';
var expect = require('chai').expect;
var Request = require('../src/messages/Request');
var Response = require('../src/messages/Response');
var Headers = require('../src/messages/Headers');
var HttpRequestEvent = require('../src/events/HttpRequestEvent');
var HttpResponseEvent = require('../src/events/HttpResponseEvent');
var Hoopla = require('hoopla');
var Http = require('../src/Http');
Http.Promise = global.Promise || require('es6-promise').Promise;

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

describe('Http', function() {
  it('can create a request', function() {
    var http = new Http(new OkDriver());

    var request = http.request(
      'GET',
      '/test',
      'test contents',
      new Headers({'x-custom': 'custom header'})
    );

    expect(request.getMethod()).to.equal('GET');
    expect(request.getUrl()).to.equal('/test');
    expect(request.getContents()).to.equal('test contents');
    expect(request.getHeaders().get('x-custom')).to.equal('custom header');
  });

  it('can create a get request without attributes', function() {
    var http = new Http(new OkDriver());
    var request = http.get('/test', null, {'x-custom': 'custom header'});

    expect(request.getMethod()).to.equal('GET');
    expect(request.getUrl()).to.equal('/test');
    expect(request.getHeaders().get('x-custom')).to.equal('custom header');
  });

  it('can create a get request with attributes', function() {
    var http = new Http(new OkDriver());
    var request = http.get('/test', {foo: 'foo val', bar: 'value2'});

    expect(request.getUrl()).to.equal('/test?foo=foo%20val&bar=value2');
  });

  it('can create a post request', function() {
    var http = new Http(new OkDriver());
    var request = http.post('/test', 'test contents', {'x-custom': 'custom header'});

    expect(request.getMethod()).to.equal('POST');
    expect(request.getUrl()).to.equal('/test');
    expect(request.getContents()).to.equal('test contents');
    expect(request.getHeaders().get('x-custom')).to.equal('custom header');
  });

  it('can send with its send method', function() {
    var http = new Http(new OkDriver());
    var request = new Request('GET', '/test');
    return http.send(request).then(function(response) {
      expect(response.getRequest()).to.equal(request);
    });
  });

  it('can send using the request\'s send method', function() {
    var http = new Http(new OkDriver());
    var request = http.request('GET', '/test');
    return request.send().then(function(response) {
      expect(response.getRequest()).to.equal(request);
    });
  });

  it('can get its dispatcher', function() {
    var http = new Http(new OkDriver());
    expect(http.getDispatcher()).to.be.instanceOf(Hoopla);
  });

  it('allows the http.request event to override the request', function() {
    var dispatcher = new Hoopla();
    var http = new Http(new OkDriver(), dispatcher);
    var request = http.get('/test');
    var override = http.get('/override');
    dispatcher.addListener('http.request', function(event) {
      expect(event).to.be.instanceOf(HttpRequestEvent);
      expect(event.getRequest()).to.equal(request);
      event.setRequest(override);
    });

    return http.send(request).then(function(response) {
      expect(response.getRequest()).to.equal(override);
    });
  });

  it('allows the http.response event to override the request', function() {
    var dispatcher = new Hoopla();
    var http = new Http(new OkDriver(), dispatcher);
    var override = new Response(new Request('GET', '/override'), 200);
    dispatcher.addListener('http.response', function(event) {
      expect(event).to.be.instanceOf(HttpResponseEvent);
      event.setResponse(override);
    });

    return http.get('/test').send().then(function(response) {
      expect(response).to.equal(override);
    });
  });

  it('rejects the promise if status code is unsuccessful', function(done) {
    var http = new Http(new NotFoundDriver());
    var request = new Request('GET', '/test');
    http.send(request).then(null, function(response) {
      expect(response.getStatus()).to.equal(404);
      expect(response.getRequest()).to.equal(request);
      done();
    });
  });

  it('can register a extension', function() {
    var passedHttp;
    var http = new Http(new OkDriver());
    var extension = {
      register: function(http) {
        passedHttp = http;
      }
    };
    http.addExtension(extension);
    expect(passedHttp).to.equal(http);
  });

  it('uses the default driver', function() {
    Http.getDefaultDriver = function() {
      return new OkDriver();
    };

    var http = new Http();
    return http.get('/test').send().then(function(response) {
      expect(response.getStatus()).to.equal(200);
    });
  });

  it('calls resolve callback', function(done) {
    var http = new Http(new OkDriver());
    var request = new Request('GET', '/test');
    return http.send(request, function(response) {
      expect(response.getStatus()).to.equal(200);
      done();
    });
  });

  it('calls reject callback', function(done) {
    var http = new Http(new NotFoundDriver());
    var request = new Request('GET', '/test');
    return http.send(request, null, function(response) {
      expect(response.getStatus()).to.equal(404);
      done();
    });
  });
});
