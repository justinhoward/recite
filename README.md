# Recite
##### An object oriented HTTP library for javascript

[![Build Status](https://travis-ci.org/justinhoward/recite.svg)](https://travis-ci.org/justinhoward/recite)

## Installation

Use npm to install recite in your project.

```bash
npm install --save recite
```

Then require it with

```javascript
var Http = require('recite');
```

Recite is also compatible with [browserify](http://browserify.org/) for use in the browser.

### Configuring Promise

Recite requires a promise library. By default it uses global.Promise, but if you're using recite
in node or older browsers, you'll need to set it manually. To set it, just set `Http.Promise`.

```javascript
Http.Promise = require('es6-promise').Promise;
```

Recite is tested against the [es6-promise](https://github.com/jakearchibald/es6-promise) module.

## Getting Started

First, create a new instance of Http

```javascript
var driver = new Http.driver.XmlHttpRequestDriver();
var http = new Http(driver);
```

Here we're creating a new `XmlHttpRequestDriver`. This driver is intended for use in web browsers.
We'll learn how to use other drivers later.
Now we're going to use our `Http` instance to create a `GET` request.

```javascript
var request = http.get('/api/post/3');
```

So far, we've just created a request object. It hasn't been sent yet. Now we'll send it.

```javascript
request.send().then(function(response) {
    console.log(response.getContents());
});
```

We called the `send()` method on the request object. This submits the request to our driver and returns a promise. Promises have a `then` method that gets called when our response comes back from the driver. The promise is resolved with a response object. Here we're simply logging the contents of that response to the console.

## Creating Requests

The Http `request()` method creates a new `Request` object (see below). It takes the following arguments:

 - `method (string)`: The HTTP request method (GET, POST, etc.)
 - `url (string)`: The url to send the request to
 - `contents (mixed)`: Optional. The body of the request
 - `headers (object)`: Optional. An object of header name/value pairs

```javascript
var request = http.request('POST', 'http://www.example.com/api/person', personData, {
    'content-type': 'application/json'
});
```

### GET

The Http `get()` method is a helper method for creating GET requests.
It works like the `request()` method, but it sets the HTTP method and automatically
encodes url attributes. It takes the arguments:

 - `url (string)`: The url to send the request to
 - `attributes (object)`: Optional. GET attributes to append the the url
 - `headers (object)`: Optional. An object of header name/value pairs

```javascript
var request = http.get('http://www.example.com/api/person', {
    id: 123
});
```

This will result in a GET request to `http://www.example.com/api/person?id=123`.

### POST

The `Http.post` method is a helper method for creating POST requests.
It works like the `request()` method, but it sets the HTTP method to POST.
It takes the arguments:

 - `url (string)`: The url to send the request to
 - `contents (mixed)`: Optional. The body of the request
 - `headers (object)`: Optional. An object of header name/value pairs

## Sending Requests

### With Http

Creating a request is the first step, but it doesn't do anything unless you send it.
The Http `send()` method does this step.

```javascript
var request = http.get('http://www.example.com');
http.send(request).then(function(response) {
    // handle response here
});
```

The `send()` method returns a `Promise` object. The promise is resolved with a
`Response` object (see below).

### With Request

The `Request` object has a `send()` method as well. This is simply a shortcut to
avoid having to send requests in two steps.

```javascript
http.get('http://www.example.com').send().then(function(response) {
    // handle response here
});
```

### Unsuccessful Requests

If a request is unsuccessful (it has a non-200 response code). The promise will be rejected instead of resolved. You can handle this with the second argument to `Promise.then`.

```javascript
http.get('http://www.example.com').send().then(function(response) {
    console.log('Request successful');
},
function(response) {
    console.log('Request failed with code ' + response.getStatus());
});
```

## The Request Object

The objects returned from `request()` (and `get()`/`post()`) are instances of `Http.Request`.
You can manually create a new `Request` object using the constructor.
The arguments for the constructor are the same as the arguments for `Http.request`.

```javascript
var request = new Http.Request('GET', 'http://example.com', contents, headers);
http.send(request);
```

`Request` objects have several methods:

 - `getMethod`/`setMethod`: gets/sets the HTTP method
 - `getUrl`/`setUrl`: gets/sets the request URL
 - `getContents`/`setContents`: gets/sets the request body content
 - `getHeaders`/`setHeaders`: gets/sets the `Headers` object (see `Headers` below)
 - `send`: sends the request and returns a Promise
 - `setHttp`: sets the `Http` instance to send with

```javascript
var request = new Http.Request('GET', 'http://example.com', contents, headers);
var method = request.getMethod(); // 'GET'
request.setUrl('http://example.com/something_else');
```

Note the `send()` method. As explained above, this is a shortcut to avoid having to save the
request in a variable before sending it. However to use it, the `setHttp` method must be called
first to set the instance of `Http` you want to send the request. This is done
automatically if you use one of the `Http` request methods instead of creating a `Request`
object manually. If you manually instantiate a request, its usually easier to use the `Http.send` method
instead of the `Request.send` method.

```javascript
var http = new Http(driver);
var request = new Http.Request('GET', 'http://example.com', contents, headers);

// You can either set the http instance
request.setHttp(http);
request.send();

// or just use Http.send()
http.send(request);
```

## The Response Object
As mentioned, the `send()` method returns a `Promise` object. This promise resolves to a `Response` object. This object is similar to the `Request` object with some differences.

The constructor takes the following arguments:

 - `request`: the request object this is a response to
 - `status`: the HTTP status code
 - `contents`: the response body
 - `headers`: an object of response header name/value pairs

Methods:

 - `getRequest`: gets the `Request` object for this response
 - `getStatus`/`setStatus`: gets/sets the HTTP response status code
 - `getContents`/`setContents`: gets/sets the response body content
 - `getHeaders`/`setHeaders`: gets/sets the `Headers` object (see "The Headers Object" below)
 - `isSuccessful`: Checks if the response status code is in the 200 range

```javascript
http.get('http://www.example.com').send().then(function(response) {
    var request = response.getRequest();
    var contents = response.getContents();
});
```

## The Headers Object
The `Headers` class is used by `Request` and `Response`. To get the object, call the `getHeaders` method.

```javascript
var headers = request.getHeaders();
```

`Headers` objects have the following methods:

 - `get(name)`: Gets the value for the given header. Returns `undefined` if the header is not set.
 - `set(name, value)`: Sets the value for the given header name.
 - `all()`: Returns a plain object of header name/value pairs.
 - `clear()`: Empties the headers.
 - `setObject(object)`: Adds all the given name/value pairs in `object`. Does not clear existing headers.

Headers are always converted to lower case when stored, so you don't have to worry about what case
you use when using the `get`/`set` methods. The object returned from `all()` will have its keys in lower case.

A `Headers` instance can also be created manually with the constructor and passed in anywhere that accepts a headers argument. The constructor takes a single argument, a plain object of header name/value pairs.

```javascript
var headers = new Headers({
    'content-type': 'application/json'
});
var request = http.get('http://example.com/api/person', {id: 123}, headers);
```

## Events
The `Http` instance has two events:

- `http.request`: Fired when a request is sent
- `http.response`: Fired when a response is returned

To subscribe to these events, you must get the dispatcher object:

```javascript
var dispatcher = http.getDispatcher();
```

The dispatcher is an instance of [Hoopla](https://github.com/justinhoward/hoopla). You can subscribe to an event with the `addListener` method. See the Hoopla documentation for more details.

The event objects are instances of `Hoopla.Event` with the addition of methods to get/set the request or response object.

### http.request

This event allows listeners to handle and modify requests before they are sent to the driver. The event object is a `Hoopla.Event` instance with the addition of two methods:

 - `getRequest`: Gets the request object
 - `setRequest`: Overrides the request object to be sent

```javascript
dispatcher.addListener('http.request', function(event) {
    var json = JSON.stringify(event.getRequest().getContents());
    event.getRequest().setContents(json);
});
```

This handler converts all request contents to JSON before sending them. At a basic level, this is how the JsonExtension works (see Extensions below).

### http.response

This event allows listeners to handle and modify responses before they get passed back to the caller. The event object is a `Hoopla.Event` instance with the addition of two methods:

 - `getResponse`: Gets the response object
 - `setResponse`: Overrides the response object to be returned

```javascript
dispatcher.addListener('http.response', function(event) {
    if (!event.getResponse().isSuccessful()) {
        console.error('An HTTP request failed');
    }
});
```

### Setting the dispatcher

By default, `Http` constructs a dispatcher object for you. However, if you are using recite as part of a larger application, you may want to use your own dispatcher. You can construct your `Http` instance with a custom version of the dispatcher by specifying it as a second argument.

```javascript
var dispatcher = new Hoopla();
var http = new Http(driver, dispatcher);
```

## Drivers

### XmlHttpRequestDriver

This driver is for use in browsers and sends requests with AJAX. To use it simply create
an instance of `Http.driver.XmlHttpRequestDriver`.

```javascript
var driver = new Http.driver.XmlHttpRequestDriver();
var http = new Http(driver);
```

That's it! Now your requests will be sent with AJAX.

### NodeHttpDriver

This driver uses the built-in `http` and `https` modules in node.js.

```javascript
var driver = new Http.driver.NodeDriver();
var http = new Http(driver);
```

### Custom Drivers

Recite is implementation agnostic. That means the back-end can use any HTTP library you want.
`XmlHttpRequestDriver` and `NodeDriver` are provided, however if you use a different library,
it is easy to hook into Recite. All you have to do is implement the `send(request, callback)` method.

Recite will call your driver's `send` method when the user calls `Http.send`.
The driver `send` method takes two arguments. The first, `request`, is the `Request` object to be sent.
The second is a callback that you need to call when your driver gets a response. The callback takes
a `Response` instance as an argument.

Here, we construct a very simple driver that always returns a successful response.

```javascript
var driver = {
    send: function(request, callback) {
        var response = new Response(request, 200);
        callback(response);
    };
}
var http = new Http(driver);
```

We could also use a constructor function and a prototype to do the same thing.

```javascript
function OkDriver() {

}
OkDriver.prototype.send = function(request, callback) {
    var response = new Response(request, 200);
    callback(response);
};

var http = new Http(new OkDriver());
```

## Extensions

You can extend Recite's functionality by adding extensions. To add an extension, use the
`Http.addExtension` method.

```javascript
var jsonExtension = new Http.extensions.JsonExtension();
http.addExtension(jsonExtension);
```

### JsonExtension

The built-in `JsonExtension` adds shortcuts for sending JSON requests. If the `content-type` of a request or response is `application/json`, the body of the request will be converted to/from JSON automatically.

```javascript
http.post('http://example.com/api/person', {name: 'Justin'}, {
    'content-type': 'application/json'
}).send().then(function(response) {
    console.log('Id is ' + response.getContents().id);
});
```

That's a bit wordy, so the extension also adds the `getJson` and `postJson` methods for you. These
set the 'content-type' and 'accepts' headers of your request to 'application/json'. Let's use the
`postJson` method to send the above request.

```javascript
http.postJson('http://example.com/api/person', {name: 'Justin'}) .send().then(function(response) {
    console.log('Id is ' + response.getContents().id);
});
```

### Custom Extensions

It's easy to create your own extensions. Extensions only require one method,
the `register(http)` method. We're going to implement an extension that logs unsuccessful
requests.

```javascript
var logExtension = {
    register: function(http) {
        http.getDispatcher().addListener('http.response', function(event) {
            if (!event.isSuccessful()) {
                console.log('Unsuccessful request');
            }
        });
    }
};
http.addExtension(logExtension);
```

We can also use a constructor function and prototype to do the same thing.

```javascript
function LogExtension() {

}
LogExtension.prototype.register = function(http) {
    http.getDispatcher().addListener('http.response', function(event) {
        if (!event.isSuccessful()) {
            console.log('Unsuccessful request');
        }
    });
};
http.addExtension(new LogExtension());
```
Check out the built-in `JsonExtension` for a more complete example.

