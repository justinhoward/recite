'use strict';
var expect = require('chai').expect;
var Http = require('../src/Http');
Http.Promise = global.Promise || require('es6-promise').Promise;

exports.shouldBehaveLikeIndex = function() {
  it('has Http', function() {
    expect(this.index).to.equal(Http);
  });

  it('has messages', function() {
    expect(this.index.Message).to.exist();
    expect(this.index.Request).to.exist();
    expect(this.index.Response).to.exist();
    expect(this.index.Headers).to.exist();
  });

  it('has the XmlHttpRequestDriver', function() {
    expect(this.index.drivers.XmlHttpRequestDriver).to.exist();
  });

  it('has events', function() {
    expect(this.index.events.HttpRequestEvent).to.exist();
    expect(this.index.events.HttpResponseEvent).to.exist();
  });

  it('has extensions', function() {
    expect(this.index.extensions.FormExtension).to.exist();
    expect(this.index.extensions.JsonExtension).to.exist();
    expect(this.index.extensions.UrlPrefixExtension).to.exist();
  });

  it('has utils', function() {
    expect(this.index.utils.encodeAttributes).to.exist();
    expect(this.index.utils.isEmptyObject).to.exist();
    expect(this.index.utils.isPlainObject).to.exist();
  });
};
