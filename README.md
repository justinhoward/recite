# Recite
##### An object oriented HTTP library for javascript

[![Build Status](https://travis-ci.org/justinhoward/recite.svg)](https://travis-ci.org/justinhoward/recite)

## Installation
Documentation in progress

## Getting Started

First, create a new instance of Http

```javascript
var driver = new Http.XmlHttpRequestDriver();
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

The Http `get()` method is a helper method for creating GET requests. It works like the `request()` method, but it sets the HTTP method and automatically encodes url attributes. It takes the arguments:

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

The `Http.post` method is a helper method for creating POST requests. It works like the `request()` method, but it sets the HTTP method to POST. It takes the arguments:

 - `url (string)`: The url to send the request to
 - `contents (mixed)`: Optional. The body of the request
 - `headers (object)`: Optional. An object of header name/value pairs

## Sending Requests

### With Http

Creating a request is the first step, but it doesn't do anything unless you send it. The Http `send()` method does this step.

```javascript
var request = http.get('http://www.example.com');
http.send(request).then(function(response) {
    // handle response here
});
```

The `send()` method returns a `Promise` object. The promise is resolved with a `Response` object (see below).

### With Request

The `Request` object has a `send()` method as well. This is simply a shortcut to avoid having to send requests in two steps.

```javascript
http.get('http://www.example.com').send(function(response) {
    // handle response here
});
```

## The Request Object
Documentation in progress

## The Response Object
Documentation in progress

## Events
Documentation in progress

## Drivers
Documentation in progress
