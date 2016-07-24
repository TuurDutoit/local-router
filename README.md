local-router
============

A small, hash-based router for the browser.


__Note:__ Due to an issue in prettydiff, the minified ES6 version of the code resides in a directory. The file you want to use is `dist/router.es6.min.js/dist/router.es6.js` instead of `dist/router.es6.min.js`. This issue has been fixed in prettydiff, but hasn't been published to NPM yet.  
I have a new, leaner method queued (using `escompress`, which relies on Babel), but due to an issue in that module ([#6](https://github.com/escompress/babel-plugin-transform-mangle-names/issues/6)), this code fails to minify.


## Files
The source code resides in `router.js`. The build system provides some transformed versions in the `dist` directory. All these files are wrapped in the UMD module format.  
Here's a detailed overview of the different files:

 * [router.js](https://github.com/TuurDutoit/local-router/blob/master/router.js): the source code, entry point for jsnext.
 * [dist/router.es6.js](https://github.com/TuurDutoit/local-router/blob/master/dist/router.es6.js): the source code, transformed to use the UMD module format, instead of ES2015 modules.
 * [dist/router.es6.min.js](https://github.com/TuurDutoit/local-router/blob/master/dist/router.es6.min.js): same as `router.es6.js` but minified.
 * [dist/router.es5.js](https://github.com/TuurDutoit/local-router/blob/master/dist/router.js): transformed to ES5 code, using the UMD module format. The entry point for NPM.
 * [dist/router.es5.min.js](https://github.com/TuurDutoit/local-router/blob/master/dist/router.min.js): same as `router.js`, but minified.


## Installation
You can either download the files from [GitHub](https://github.com/TuurDutoit/local-router), or use NPM instead:

```
npm install local-router
```

Then you can either include local-router in your [Browserify](http://browserify.org/) or [RequireJS](http://requirejs.org/) bundle, or load it directly in your HTML page, with a `<script>` tag.


## Usage
This module exports a single class, `Router`. Create an instance of this class, passing in two objects: `routes` (required) and `options` (optional).

### Supported options are:

#### routes
Required, object(string -> boolean).  
An object mapping route names (e.g. `about`, `result`) to booleans, indicating whether that route accepts any arguments, or objects with `encode` and/or `decode` methods. The `encode` method will be passed the data passed to `Router.go()` and is expected to return a stringified version of it. The `decode` method will be passed the data string from the URL and is expected to return the data it contains. If either one is not specified (or you pass `true`), the default encode/decode methods will be used instead (respectively)

#### options.index
String.  
A string representing the default route. If an invalid route is browsed to, the browser will be redirected to this route. If left out, `index` will be used.

#### options.prefix
String.  
A string that is used to prefix the class names added to the document body, e.g. browsing to `#index` will add the `page-index` class to the body. The default is `page-`.

#### options.elem
String or Element.  
The HTML element or id or CSS selector of the HTMl element to add the classes to. Default is the body.

#### options.separator
String.  
The string separating the name of the route and the data in the URL. Default: `-`.

### Example
Here is an example of how to make a new Router:

```javascript
const router = new Router({
  input: false,
  result: {
    encode: function(data) {return data;},
    decode: function(str) {return str;}
  }
}, {
  index: "input",
  prefix: "mode-"
});
```

This router would accepts routes like: `#input`, `#result-abcdef`, `#result-`, `#result-Tuur_Dutoit`...
If an invalid route is browsed to (e.g. `#non-existent`, or just `/`), the browser is redirected to `#input`.
The class names added to the body will be: `mode-input` or `mode-result`, depending on the current route, of course.

### Router.on(string route, function callback)
Adds a callback to the router. When the user browses to `#route` (substituting `route` with the `route` argument, of course), this callback will be called. If the route accepts a data string, the decoded data will be passed in the first argument.  
Here's an example:

```
router.on("result", data => {
  console.log(`result: ${data}`);
});
```

If the user then browses to `#result-hello`, the string `result: hello` will be logged.


### Router.off(string route, function callback)
Removes the callback from this router, i.e. does the opposite of `router.on`.

### Router.go(string route, [any data])
Redirect the browser to a route. If this route accepts a data string, the encoded `data` string will be added after the separator.  
Here are a few examples:

```javascript
router.go("input");
router.go("result", "hello");
router.go("result");
```

The browser will be redirected to `#input`, `#result-hello` and `#result-` respectively. In the first and last examples, no data will be passed to the callbacks.
