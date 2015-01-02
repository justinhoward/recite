'use strict';
var expect = require('chai').expect;
var isEmptyObject = require('../../src/utilities/isEmptyObject');

describe('utilities/isEmptyObject', function() {
    it('correctly identifies an empty object', function() {
        expect(isEmptyObject({})).to.be.true();
    });

    it('is false for objects with properties', function() {
        expect(isEmptyObject({foo: 'val'})).to.be.false();
    });
});