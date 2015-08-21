'use strict';
var expect = require('chai').expect;
var Message = require('../../src/messages/Message');
var Headers = require('../../src/messages/Headers');

describe('messages/Message', function() {
  it('can be constructed', function() {
    var headers = new Headers();
    var message = new Message('test', headers);

    expect(message.getContents()).to.equal('test');
    expect(message.getHeaders()).to.equal(headers);
  });

  it('converts plain object headers into a header instance', function() {
    var headers = {foo: 'foo value'};

    // when passed to the constructor
    var message = new Message('test', headers);
    expect(message.getHeaders()).to.be.instanceOf(Headers);
    expect(message.getHeaders().get('foo')).to.equal('foo value');

    // and when using the setHeaders method
    message.setHeaders(headers);
    expect(message.getHeaders()).to.be.instanceOf(Headers);
  });
});
