'use strict';
var expect = require('chai').expect;
var HttpResponseEvent = require('../../src/events/HttpResponseEvent');
var Request = require('../../src/messages/Request');
var Response = require('../../src/messages/Response');

describe('events/HttpRequestEvent', function() {
  it('can be constructed', function() {
    var request = new Request('GET', '/test');
    var response = new Response(request, 200);
    var event = new HttpResponseEvent(response, {foo: 'foo val'});

    expect(event.getResponse()).to.equal(response);
    expect(event.get('foo')).to.equal('foo val');
  });

  it('can set a request', function() {
    var request = new Request('GET', '/test');
    var responseA = new Response(request, 200);
    var responseB = new Response(request, 200);
    var event = new HttpResponseEvent(responseA);
    event.setResponse(responseB);

    expect(event.getResponse()).to.equal(responseB);
  });
});
