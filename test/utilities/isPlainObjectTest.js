'use strict';
var expect = require('chai').expect;
var isPlainObject = require('../../src/utilities/isPlainObject');

describe('utilities/isPlainObject', function() {
  it('correctly identifies an empty plain object', function() {
    expect(isPlainObject({})).to.be.true();
  });

  it('correctly identifies a plain object with properties', function() {
    expect(isPlainObject({foo: 'val'})).to.be.true();
  });

  it('is false for an object with a constructor', function() {
    function Foo() {}

    expect(isPlainObject(new Foo())).to.be.false();
  });
});
