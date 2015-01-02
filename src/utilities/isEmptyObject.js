'use strict';
var isPlainObject = require('./isPlainObject');

module.exports = function(object) {
    if (!isPlainObject(object)) {
        return false;
    }

    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
};