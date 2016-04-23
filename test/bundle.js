(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Router {
  constructor({ routes = {}, defaultRoute, prefix = "mode-" } = {}) {
    this.$body = document.body;
    this.prefix = prefix;
    this.defaultRoute = defaultRoute;
    this.routes = routes;
    this._routes = Object.keys(routes);
    this.rroutes = new RegExp(`^(${ this._routes.join("|") })$`, "i");
    this.rhashes = new RegExp(`^#(${ this._routes.map(this.getHash, this).join("|") })$`, "i");
    this.rcallbacks = new RegExp(`^(${ this._routes.join("|") }|\\*)$`);
    this.allClasses = this._routes.map(route => this.prefix + route);
    this.callbacks = { "*": [] };
    this.checks = {};
    this.classes = {};

    if (!this.defaultRoute && this._routes.length) {
      this.defaultRoute = this._routes[0];
    }

    this.init();
  }

  init() {
    // Prep callbacks, checks and classes objects
    this._routes.forEach(route => {
      this.callbacks[route] = [];
      this.checks[route] = new RegExp(`^#${ this.getHash(route) }$`, "i");
      this.classes[route] = this.prefix + route;
    });

    window.addEventListener("hashchange", this);
    window.addEventListener("load", this);
  }

  getHash(route) {
    return this.routes[route] ? route + "-.*" : route;
  }

  handleEvent(e) {
    if (this.rhashes.test(location.hash)) {
      let route;
      let str;

      for (let i = 0, len = this._routes.length; i < len; i++) {
        route = this._routes[i];
        if (this.checks[route].test(location.hash)) {
          if (this.routes[route]) {
            str = decodeURIComponent(location.hash.slice(route.length + 2));
          }
          break;
        }
      }

      this.$body.classList.remove(...this.allClasses);
      this.$body.classList.add(this.classes[route]);

      this.callbacks[route].forEach(cb => {
        cb(str);
      });

      this.callbacks["*"].forEach(cb => {
        cb(route, str);
      });
    } else {
      location.hash = "#" + this.defaultRoute;
    }
  }

  on(route, cb) {
    if (this.rcallbacks.test(route)) {
      this.callbacks[route].push(cb);
    }

    return this;
  }

  off(route, cb) {
    if (this.rcallbacks.test(route)) {
      let index = this.callbacks[route].indexOf(cb);

      if (index !== -1) {
        this.callbacks[route].splice(index, 1);
      }
    }

    return this;
  }

  go(route, str) {
    if (this.rroutes.test(route)) {
      if (this.routes[route]) {
        route += "-" + (str ? encodeURIComponent(str) : "");
      }

      let hash = "#" + route;
      if (location.hash !== hash) {
        location.hash = hash;
      }
    }

    return this;
  }
}
exports.default = Router;

},{}],2:[function(require,module,exports){
"use strict";

var _router = require("../build/router.es6");

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.router = new _router2.default({
  routes: { input: false, result: true },
  defaultRoute: "input"
});

router.on("*", (route, data) => {
  console.log(`route: '${ route }'. data: '${ data }'`);
});

router.on("input", () => {
  console.log("input");
});

router.on("result", data => {
  console.log(`result: '${ data }'`);
});

},{"../build/router.es6":1}]},{},[2]);
