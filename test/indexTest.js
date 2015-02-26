'use strict';
var expect = require('chai').expect;
var index = require('../index');
var Http = require('../src/Http');
Http.Promise = require('es6-promise').Promise;

describe('index', function() {
    it('has Http', function() {
        expect(index).to.equal(Http);
    });

    it('has messages', function() {
        expect(index.Message).to.exist();
        expect(index.Request).to.exist();
        expect(index.Response).to.exist();
        expect(index.Headers).to.exist();
    });

    it('has drivers', function() {
        expect(index.driver.XmlHttpRequestDriver).to.exist();
        expect(index.driver.NodeDriver).to.exist();
    });

    it('has events', function() {
        expect(index.event.HttpRequestEvent).to.exist();
        expect(index.event.HttpResponseEvent).to.exist();
    });

    it('has extensions', function() {
        expect(index.extensions.JsonExtension).to.exist();
    });

    it('has utils', function() {
        expect(index.utils.encodeAttributes).to.exist();
        expect(index.utils.isEmptyObject).to.exist();
        expect(index.utils.isPlainObject).to.exist();
    });
});
