'use strict';
var expect = require('chai').expect;
var Request = require('../../src/messages/Request');
var Response = require('../../src/messages/Response');
var Headers = require('../../src/messages/Headers');

describe('messages/Response', function() {
    it('can be constructed', function() {
        var request = new Request('get', '/test');
        var headers = new Headers();
        var response = new Response(request, 200, 'foo', headers);

        expect(response.getRequest()).to.equal(request);
        expect(response.getStatus()).to.equal(200);
        expect(response.getContents()).to.equal('foo');
        expect(response.getHeaders()).to.equal(headers);
    });

    it('normalizes status to an integer', function() {
        var request = new Request('get', '/test');
        var response = new Response(request, '200');

        // on construction
        expect(response.getStatus()).to.equal(200);

        // on set
        response.setStatus(404.3);
        expect(response.getStatus()).to.equal(404);
    });

    it('can check if it is successful', function() {
        var request = new Request('get', '/test');
        var response = new Response(request, '200');

        // for an ok request
        expect(response.isSuccessful()).to.be.true();

        // for a redirect
        response.setStatus(300);
        expect(response.isSuccessful()).to.be.false();

        // for not found
        response.setStatus(404);
        expect(response.isSuccessful()).to.be.false();

        // for continue
        response.setStatus(100);
        expect(response.isSuccessful()).to.be.false();
    });
});