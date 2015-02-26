'use strict';
var Http = require('./browser');

Http.driver.NodeDriver = require('./src/drivers/NodeDriver');

module.exports = Http;
