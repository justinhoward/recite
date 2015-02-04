'use strict';
var expect = require('chai').expect;
var JsonExtension = require('../../src/extensions/JsonExtension');
var Http = require('../../src/Http');
var Response = require('../../src/messages/Response');

function OkDriver() {
    this.send = function(request, callback) {
        callback(new Response(request, 200, '{"status": "ok"}', {
            'content-type': 'application/json'
        }));
    };
}

describe('extensions/JsonExtension', function() {
    it('stringifies JSON requests when content-type is set', function() {
        var http = new Http(new OkDriver());
        http.addExtension(new JsonExtension());

        var request = http.post('/test', {foo: 'foo val'}, {
            'content-type': 'application/json'
        });

        return http.send(request).then(function(response) {
            expect(response.getRequest().getContents()).to.equal('{"foo":"foo val"}');
        });
    });

    it('parses JSON response when content-type is set', function() {
        var http = new Http(new OkDriver());
        http.addExtension(new JsonExtension());

        var request = http.get('/test');

        return http.send(request).then(function(response) {
            expect(response.getContents()).to.deep.equal({
                status: 'ok'
            });
        });
    });

    it('can create a json get request', function() {
        var http = new Http(new OkDriver());
        http.addExtension(new JsonExtension());

        var request = http.getJson('/test/');
        expect(request.getMethod()).to.equal('GET');
        expect(request.getHeaders().get('content-type')).to.equal('application/json');
        expect(request.getHeaders().get('accept')).to.equal('application/json');
    });

    it('can create a json post request', function() {
        var http = new Http(new OkDriver());
        http.addExtension(new JsonExtension());

        var request = http.postJson('/test/');
        expect(request.getMethod()).to.equal('POST');
        expect(request.getHeaders().get('content-type')).to.equal('application/json');
        expect(request.getHeaders().get('accept')).to.equal('application/json');
    });
});