(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = function () {
  function Router() {
    var _this = this;

    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$routes = _ref.routes;
    var routes = _ref$routes === undefined ? {} : _ref$routes;
    var defaultRoute = _ref.defaultRoute;
    var _ref$prefix = _ref.prefix;
    var prefix = _ref$prefix === undefined ? "mode-" : _ref$prefix;

    _classCallCheck(this, Router);

    this.$body = document.body;
    this.prefix = prefix;
    this.defaultRoute = defaultRoute;
    this.routes = routes;
    this._routes = Object.keys(routes);
    this.rroutes = new RegExp("^(" + this._routes.join("|") + ")$", i);
    this.rhashes = new RegExp("^#(" + this._routes.map(this.getHash, this).join("|") + ")$", i);
    this.rcallbacks = new RegExp("^(" + this._routes.join("|") + "|*)$");
    this.allClasses = this._routes.map(function (route) {
      return _this.prefix + route;
    });
    this.callbacks = { "*": [] };
    this.checks = {};
    this.classes = {};

    if (!this.defaultRoute && this._routes.length) {
      this.defaultRoute = this._routes[0];
    }

    this.init();
  }

  _createClass(Router, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      // Prep callbacks, checks and classes objects
      this._routes.forEach(function (route) {
        _this2.callbacks[route] = [];
        _this2.checks[route] = _this2.getHash(route);
        _this2.classes[route] = _this2.prefix + route;
      });

      window.addEventListener("hashchange", this);
      window.addEventListener("load", this);
    }
  }, {
    key: "getHash",
    value: function getHash(route) {
      return this.routes[route] ? route + "-.*" : route;
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(e) {
      var _this3 = this;

      if (this.rhashes.test(location.hash)) {
        (function () {
          var _$body$classList;

          var route = void 0;
          var str = void 0;

          for (var _i = 0, len = _this3._routes.length; _i < len; _i++) {
            route = _this3._routes[_i];
            if (location.hash.test(_this3.checks[route])) {
              if (_this3.routes[route]) {
                str = decodeURIComponent(location.hash.slice(route.length + 2));
              }
              break;
            }
          }

          (_$body$classList = _this3.$body.classList).remove.apply(_$body$classList, _toConsumableArray(_this3.allClasses));
          _this3.$body.classList.add(_this3.classes[route]);

          _this3.callbacks[route].forEach(function (cb) {
            cb(str);
          });

          _this3.callbacks["*"].forEach(function (cb) {
            cb(route, str);
          });
        })();
      } else {
        location.hash = "#" + this.defaultRoute;
      }
    }
  }, {
    key: "on",
    value: function on(route, cb) {
      if (this.rcallbacks.test(route)) {
        this.callbacks[route].push(cb);
      }

      return this;
    }
  }, {
    key: "off",
    value: function off(route, cb) {
      if (this.rcallbacks.test(route)) {
        var index = this.callbacks[route].indexOf(cb);

        if (index !== -1) {
          this.callbacks[route].splice(index, 1);
        }
      }

      return this;
    }
  }, {
    key: "go",
    value: function go(route, str) {
      if (rroutes.test(route)) {
        if (this.routes[route]) {
          route += "-" + encodeURIComponent(str);
        }
        location.hash = "#" + route;
      }

      return this;
    }
  }]);

  return Router;
}();

exports.default = Router;

},{}]},{},[1]);
