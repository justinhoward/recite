'use strict';
var expect = require('chai').expect;
var FormExtension = require('../../src/extensions/FormExtension');
var FormData = require('form-data');
var Http = require('../../src/Http');
var Response = require('../../src/messages/Response');
var stream = require('stream');

function OkDriver() {
  this.send = function(request, callback) {
    callback(new Response(request, 200));
  };
}

describe('extensions/FormExtension', function() {
  beforeEach(function() {
    FormExtension.FormData = FormData;
    this.http = new Http(new OkDriver());
    this.http.addExtension(new FormExtension());
  });

  before(function() {
    this.testData = function(request, data, done) {
      this.http.send(request).then(function(response) {
        var contents = '';
        var writable = new stream.Writable({
          write: function(chunk, encoding, next) {
            contents += chunk.toString();
            next();
          }
        });

        writable.on('finish', function() {
          Object.keys(data).forEach(function(key) {
            expect(contents).to.match(new RegExp('name="' + key + '"'));
            expect(contents).to.match(new RegExp(data[key]));
          });
          done();
        });

        response.getRequest().getContents().pipe(writable);
      });
    };
  });

  it('sets the boundary header', function() {
    var request = this.http.post('/test', null, {
      'content-type': 'multipart/form-data'
    });

    return this.http.send(request).then(function(response) {
      expect(response.getRequest().getHeaders().get('content-type'))
        .to.match(/multipart\/form-data; boundary=.+/);
    });
  });

  it('sets the contents', function(done) {
    var data = {foo: 'foo val'};
    var request = this.http.post('/test', {foo: 'foo val'}, {
      'content-type': 'multipart/form-data'
    });
    this.testData(request, data, done);
  });

  it('can create a form post request', function() {
    var request = this.http.postForm('/test');
    expect(request.getMethod()).to.equal('POST');
    expect(request.getHeaders().getContentType()).to.equal('multipart/form-data');
  });

  it('can create a form request with a given method', function() {
    var request = this.http.requestForm('PUT', '/test');
    expect(request.getMethod()).to.equal('PUT');
    expect(request.getHeaders().getContentType()).to.equal('multipart/form-data');
  });

  it('browser works with global FormData object', function(done) {
    FormExtension.toMultipart = FormExtension.toMultipartBrowser;
    global.FormData = FormData;
    var data = {foo: 'foo val'};
    var request = this.http.post('/test', {foo: 'foo val'}, {
      'content-type': 'multipart/form-data'
    });
    this.testData(request, data, done);
  });

  it('can accept a FormData object', function(done) {
    var form = new FormData();
    form.append('foo', 'foo val');
    var request = this.http.postForm('/test', form);
    this.testData(request, {foo: 'foo val'}, done);
  });
});
