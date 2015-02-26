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

    it('has case insensitive keys', function() {
        var headers = new Headers();

        // when setting
        headers.set('Foo', 'Foo Value');
        expect(headers.get('foo')).to.equal('Foo Value');

        // and when getting
        headers.set('bar', 'Bar Value');
        expect(headers.get('BAR')).to.equal('Bar Value');
    });

    it('can get all keys', function() {
        var headers = new Headers({
            Foo: 'foo val',
            bar: 'bar val'
        });

        var all = headers.all();
        expect(all.foo).to.equal('foo val');
        expect(all.bar).to.equal('bar val');
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

        expect(headers.all()).to.deep.equal({foo: 'foo val', bar: 'bar val'});
    });
});