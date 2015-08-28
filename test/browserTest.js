'use strict';
var expect = require('chai').expect;
var fs = require('fs');
var shared = require('./sharedIndex');
var Http = require('../src/Http');
Http.Promise = global.Promise || require('es6-promise').Promise;

describe('browser', function() {
  beforeEach(function() {
    this.index = require('../browser');
  });

  afterEach(function() {
    // force requiring browser again to reset the default driver
    delete require.cache[fs.realpath(__dirname + '/../browser.js')];
  });

  it('has a default driver of XmlHttpRequestDriver', function() {
    expect(this.index.getDefaultDriver()).to.be.instanceOf(this.index.drivers.XmlHttpRequestDriver);
  });

  shared.shouldBehaveLikeIndex();
});
