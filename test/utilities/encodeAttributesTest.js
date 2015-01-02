'use strict';
var expect = require('chai').expect;
var encodeAttributes = require('../../src/utilities/encodeAttributes');

describe('utilities/encodeAttributes', function() {
    it('can encode a single attribute', function() {
        expect(encodeAttributes({foo: 'value'})).to.equal('foo=value');
    });

    it('can encode multiple attributes', function() {
        expect(encodeAttributes({
            foo: 'val1',
            bar: 'val2'
        })).to.equal('foo=val1&bar=val2');
    });

    it('encodes non-url safe characters', function() {
        expect(encodeAttributes({foo: 'foo value'})).to.equal('foo=foo%20value');
    });

    it('encodes empty values', function() {
        expect(encodeAttributes({foo: ''})).to.equal('foo=');
    });
});