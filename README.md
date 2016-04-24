local-router
============

A small, hash-based router for the browser.


__Note:__ Due to an issue in prettydiff, the minified ES6 version of the code resides in a directory. The file you want to use is `dist/router.es6.min.js/dist/router.es6.js` instead of `dist/router.es6.min.js`. This issue has been fixed in prettydiff, but hasn't been published to NPM yet.


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
This module exports a single class, `Router`. Create an instance of this class, passing in an options object.

### Supported options are:

#### options.routes
Required, object(string -> boolean).  
An object mapping route names (e.g. `about`, `result`) to booleans, indicating whether that route accepts a data string.

#### options.defaultRoute
Sort-of required, string.  
A string representing the default route. If an invalid route is browsed to, the browser will be redirected to this route. If left out, the first route in the `routes` object will be used.

#### options.prefix
Optional, string.  
A string that is used to prefix the class names added to the document body. The default is `mode-`.

### Example
Here is an example of how to make a new Router:

```javascript
const router = new Router({
  router: {
    input: false,
    result: true
  },
  defaultRoute: "input",
  prefix: "page-"
});
```

This router would accepts routes like: `#input`, `#result-abcdef`, `#result-`, `#result-Tuur_Dutoit`...
If an invalid route is browsed to (e.g. `#non-existent`, or just `/`), the browser is redirected to `#input`.
The class names added to the body will be: `page-input` or `page-result`, depending on the current route, of course.

### Router.on(string route, function callback)
Adds a callback to the router. When the user browses to `#route` (substituting `route` with the `route` argument, of course), this callback will be called. If the route accepts a data string, it will be passed in the first argument, otherwise the empty string will be passed in.  
Here's an example:

```
router.on("result", data => {
  console.log(`result: ${data}`);
});
```

If the user then browses to `#result-hello`, the string `result: hello` will be logged.


### Router.off(string route, function callback)
Removes the callback from this router, i.e. does the opposite of `router.on`.

### Router.go(string route, [string data])
Redirect the browser to a route. If this route accepts a data string, the `data` string will be added after a dash.  
Here are a few examples:

```javascript
router.go("input");
router.go("result", "hello");
router.go("result");
```

The browser will be redirected to `#input`, `#result-hello` and `#result-` respectively. In the first and last examples, the data string passed to the callbacks will be the empty string.
