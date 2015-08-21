'use strict';
var expect = require('chai').expect;
var HttpRequestEvent = require('../../src/events/HttpRequestEvent');
var Request = require('../../src/messages/Request');

describe('events/HttpRequestEvent', function() {
  it('can be constructed', function() {
    var request = new Request('GET', '/test');
    var event = new HttpRequestEvent(request, {foo: 'foo val'});

    expect(event.getRequest()).to.equal(request);
    expect(event.get('foo')).to.equal('foo val');
  });

  it('can set a request', function() {
    var requestA = new Request('GET', '/testA');
    var requestB = new Request('GET', '/testB');
    var event = new HttpRequestEvent(requestA);
    event.setRequest(requestB);

    expect(event.getRequest()).to.equal(requestB);
  });
});
