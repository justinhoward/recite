'use strict';

module.exports = function(object) {
    return '' + object === '[object Object]' && object.constructor === Object;
};