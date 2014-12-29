'use strict';

var postJson = function(url, contents, headers) {
    var request = this.post(url, contents, headers);
    return requestToJson(request);
};

var getJson = function(url, attributes, headers) {
    var request = this.get(url, attributes, headers);
    return requestToJson(request);
};

var httpRequestListener = function(event) {
    var request = event.getRequest();
    if (request.getHeaders().get('content-type') === 'application/json') {
        var contents = request.getContents();
        if ('' + contents === '[object Object]') {
            request.setContents(JSON.stringify(contents));
        }
    }
};

var httpResponseListener = function(event) {
    var response = event.getResponse();
    if (response.getHeaders().get('content-type') === 'application/json') {
        var contents = response.getContents();
        if (typeof contents === 'string') {
            response.setContents(JSON.parse(contents));
        }
    }
};

var json = function(http) {
    var dispatcher = http.getDispatcher();

    http.postJson = postJson;
    http.getJson = getJson;

    dispatcher.addListener('HttpRequest', httpRequestListener);
    dispatcher.addListener('HttpResponse', httpResponseListener);
};

json.postJson = postJson;
json.getJson = getJson;
json.httpRequestListener = httpRequestListener;
json.httpResponseListener = httpResponseListener;

function requestToJson(request) {
    var headers = request.getHeaders();
    headers.set('content-type', 'application/json');
    headers.set('accept', 'application/json');
    return request;
}

module.exports = json;