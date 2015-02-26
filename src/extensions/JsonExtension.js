'use strict';
var isPlainObject = require('../utilities/isPlainObject');

function JsonExtension() {

}
var proto = JsonExtension.prototype;

var getJson = function(url, attributes, headers) {
    var request = this.get(url, attributes, headers);
    return requestToJson(request);
};

var postJson = function(url, contents, headers) {
    var request = this.post(url, contents, headers);
    return requestToJson(request);
};

proto.register = function(http) {
    this.addListeners(http.getDispatcher());
    if (!http.getJson) {
        http.getJson = getJson;
    }
    if (!http.postJson) {
        http.postJson = postJson;
    }
};

proto.addListeners = function(dispatcher) {
    dispatcher.addListener('http.request', JsonExtension.httpRequestListener);
    dispatcher.addListener('http.response', JsonExtension.httpResponseListener);
};

JsonExtension.httpRequestListener = function(event) {
    var request = event.getRequest();
    if (request.getHeaders().get('content-type') === 'application/json') {
        var contents = request.getContents();
        if (isPlainObject(contents)) {
            request.setContents(JSON.stringify(contents));
        }
    }
};

JsonExtension.httpResponseListener = function (event) {
    var response = event.getResponse();
    if (response.getHeaders().get('content-type') === 'application/json') {
        var contents = response.getContents();
        if (typeof contents === 'string') {
            response.setContents(JSON.parse(contents));
        }
    }
};

function requestToJson(request) {
    var headers = request.getHeaders();
    headers.set('content-type', 'application/json');
    headers.set('accept', 'application/json');
    return request;
}

module.exports = JsonExtension;
