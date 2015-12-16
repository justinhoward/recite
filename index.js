'use strict';
var Http = require('./browser');
var FormData = require('form-data');

Http.drivers.NodeDriver = require('./src/drivers/NodeDriver');

Http.getDefaultDriver = function() {
  return new Http.drivers.NodeDriver();
};

Http.extensions.FormExtension.FormData = FormData;

module.exports = Http;
