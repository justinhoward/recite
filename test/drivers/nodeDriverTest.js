'use strict';
var expect = require('chai').expect;
var Request = require('../../src/messages/Request');
var NodeDriver = require('../../src/drivers/NodeDriver');
var http = require('http');
var FormData = require('form-data');
var stream = require('stream');
var server;

describe('drivers/NodeDriver/http', function() {
  before(function() {
    server = http.createServer(function(request, response) {
      var headers = {};
      for (var name in request.headers) {
        if (name.substr(0, 2) === 'x-') {
          headers[name] = request.headers[name];
        }
      }

      var body = '';
      request.on('data', function(chunk) {
        body += chunk.toString();
      });

      request.on('end', function() {
        if (request.url === '/good') {
          response.writeHead(200, headers);
          if (body) {
            response.end(body);
          } else {
            response.end('yes ' + request.method);
          }
        } else {
          response.writeHead(500, headers);
          response.end('no');
        }
      });
    });

    server.listen(8763);
  });

  after(function() {
    server.close();
  });

  it('sends a get request', function(done) {
    var driver = new NodeDriver();
    var request = new Request('GET', 'http://localhost:8763/good');
    driver.send(request, function(response) {
      expect(response.getStatus()).to.equal(200);
      expect(response.getContents()).to.equal('yes GET');
      done();
    });
  });

  it('sends a post request', function(done) {
    var driver = new NodeDriver();
    var request = new Request('POST', 'http://localhost:8763/good');
    driver.send(request, function(response) {
      expect(response.getContents()).to.equal('yes POST');
      done();
    });
  });

  it('sends and receives headers', function(done) {
    var driver = new NodeDriver();
    var request = new Request('GET', 'http://localhost:8763/good', null, {
      'x-foobar': 'header test'
    });
    driver.send(request, function(response) {
      expect(response.getHeaders().get('x-foobar')).to.equal('header test');
      done();
    });
  });

  it('reports error codes', function(done) {
    var driver = new NodeDriver();
    var request = new Request('GET', 'http://localhost:8763/bad');
    driver.send(request, function(response) {
      expect(response.getStatus()).to.equal(500);
      done();
    });
  });

  it('reports not found as 404', function(done) {
    var driver = new NodeDriver();
    var request = new Request('GET', 'http://foobar');
    driver.send(request, function(response) {
      expect(response.getStatus()).to.equal(404);
      done();
    });
  });

  it('can send a FormData instance', function(done) {
    var driver = new NodeDriver();
    var form = new FormData();
    form.append('foo', 'foo value');
    var request = new Request('POST', 'http://localhost:8763/good', form);
    driver.send(request, function(response) {
      expect(response.getContents()).to.match(/name="foo"/);
      expect(response.getContents()).to.match(/foo value/);
      done();
    });
  });

  it('can send a Stream instance', function(done) {
    var driver = new NodeDriver();
    var readable = new stream.Readable();
    readable._read = function() {
      this.push('foobar');
      this.push(null);
    };
    var request = new Request('POST', 'http://localhost:8763/good', readable);
    driver.send(request, function(response) {
      expect(response.getContents()).to.equal('foobar');
      done();
    });
  });
});
