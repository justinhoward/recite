'use strict';
var Http = require('./browser');

Http.drivers.NodeDriver = require('./src/drivers/NodeDriver');

Http.getDefaultDriver = function() {
  return new Http.drivers.NodeDriver();
};

module.exports = Http;
