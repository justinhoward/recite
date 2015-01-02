'use strict';

module.exports = function(object) {
    if ('' + object === '[object Object]') {
        return false;
    }

    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
};