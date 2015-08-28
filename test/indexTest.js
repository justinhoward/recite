'use strict';
var expect = require('chai').expect;
var fs = require('fs');
var shared = require('./sharedIndex');
var Http = require('../src/Http');
Http.Promise = global.Promise || require('es6-promise').Promise;

describe('index', function() {
  beforeEach(function() {
    this.index = require('../index');
  });

  afterEach(function() {
    // force requiring index again to reset the default driver
    delete require.cache[fs.realpath(__dirname + '/../index.js')];
  });

  it('has the node driver', function() {
    expect(this.index.drivers.NodeDriver).to.exist();
  });

  it('has a default driver of NodeDriver', function() {
    expect(this.index.getDefaultDriver()).to.be.instanceOf(this.index.drivers.NodeDriver);
  });

  shared.shouldBehaveLikeIndex();
});
