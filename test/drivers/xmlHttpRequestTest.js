'use strict';
var expect = require('chai').expect;
var Request = require('../../src/messages/Request');
var XmlHttpRequestDriver = require('../../src/drivers/XmlHttpRequestDriver');

function Xhr(responseStatus, responseContent, responseHeaders) {
    this._requestHeaders = {};
    this._responseStatus = responseStatus || 200;
    this._responseContent = responseContent;
    this._responseHeaders = responseHeaders || {};
}

Xhr.prototype.open = function(method, url) {
    this._method = method;
    this._url = url;
};

Xhr.prototype.setRequestHeader = function(name, value) {
    this._requestHeaders[name] = value;
};

Xhr.prototype.getAllResponseHeaders = function() {
    var headers = [];
    for (var key in this._responseHeaders) {
        headers.push(key + ': ' + this._responseHeaders[key]);
    }
    return headers.join("\n");
};

Xhr.prototype.getResponseHeader = function(name) {
    return this._responseHeaders[name];
};

Xhr.prototype.send = function(data) {
    this._data = data;
    this.status = this._responseStatus;
    this.response = this._responseContent;
    this.readyState = 4;
    if (this.onreadystatechange) {
        this.onreadystatechange();
    }
};

describe('drivers/XmlHttpRequestDriver', function() {
    it('opens the request', function() {
        var xhr = new Xhr();
        var driver = new XmlHttpRequestDriver(function() {
            return xhr;
        });
        var request = new Request('get', '/test');
        driver.send(request, function() {});

        expect(xhr._url).to.equal('/test');
        expect(xhr._method).to.equal('GET');
    });

    it('sets the request headers', function() {
        var xhr = new Xhr();
        var driver = new XmlHttpRequestDriver(function() {
            return xhr;
        });
        var request = new Request('get', '/test', '', {foo: 'foo val', bar: 'bar val'});
        driver.send(request, function() {});

        expect(xhr._requestHeaders.foo).to.equal('foo val');
        expect(xhr._requestHeaders.bar).to.equal('bar val');
    });

    it('sends the request content', function() {
        var xhr = new Xhr();
        var driver = new XmlHttpRequestDriver(function() {
            return xhr;
        });
        var request = new Request('get', '/test', 'request data');
        driver.send(request, function() {});

        expect(xhr._data).to.equal('request data');
    });

    it('returns the response', function(done) {
        var xhr = new Xhr(200, 'response content');
        var driver = new XmlHttpRequestDriver(function() {
            return xhr;
        });
        var request = new Request('get', '/test');
        driver.send(request, function(response) {
            expect(response.getStatus()).to.equal(200);
            expect(response.getContents()).to.equal('response content');
            done();
        });
    });

    it('parses the response headers', function(done) {
        var xhr = new Xhr(200, null, {foo: 'foo value', bar: 'bar value'});
        var driver = new XmlHttpRequestDriver(function() {
            return xhr;
        });
        var request = new Request('get', '/test');
        driver.send(request, function(response) {
            expect(response.getHeaders().get('foo')).to.equal('foo value');
            expect(response.getHeaders().get('bar')).to.equal('bar value');
            done();
        });
    });
});