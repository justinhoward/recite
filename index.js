'use strict';
var Http = require('./browser');

Http.drivers.NodeDriver = require('./src/drivers/NodeDriver');

module.exports = Http;
