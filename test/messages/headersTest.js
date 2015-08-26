'use strict';
var expect = require('chai').expect;
var Headers = require('../../src/messages/Headers');

describe('messages/Headers', function() {
  it('can be constructed with a plain object', function() {
    var headers = new Headers({
      foo: 'foo value',
      bar: 'bar value'
    });

    expect(headers.get('foo')).to.equal('foo value');
    expect(headers.get('bar')).to.equal('bar value');
  });

  it('keys can be searched case-insensitively', function() {
    var headers = new Headers();

    // when setting
    headers.set('Foo', 'Foo Value');
    expect(headers.get('foo')).to.equal('Foo Value');

    // and when getting
    headers.set('bar', 'Bar Value');
    expect(headers.get('BAR')).to.equal('Bar Value');
  });

  it('uses latest case of header', function() {
    var headers = new Headers();

    headers.set('Foo', 'Foo Value');
    headers.set('foo', 'Bar Value');

    expect(headers.all()).to.deep.equal({foo: 'Bar Value'});
  });

  it('can get all keys and maintain case', function() {
    var headers = new Headers({
      Foo: 'foo val',
      bar: 'bar val'
    });

    var all = headers.all();
    expect(all.Foo).to.equal('foo val');
    expect(all.bar).to.equal('bar val');
  });

  it('can remove a key', function() {
    var headers = new Headers({
      foo: 'foo value',
      bar: 'bar value'
    });

    headers.remove('foo');

    expect(headers.all()).to.deep.equal({bar: 'bar value'});
  });

  it('can clear keys', function() {
    var headers = new Headers({foo: 'foo val'});
    headers.clear();

    expect(headers.get('foo')).to.be.undefined();
  });

  it('can set with an object', function() {
    var headers = new Headers();
    headers.setObject({
      foo: 'foo val',
      Bar: 'bar val'
    });

    expect(headers.all()).to.deep.equal({foo: 'foo val', Bar: 'bar val'});
  });
});
