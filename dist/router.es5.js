(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.Router = global.Router || {})));
}(this, function (exports) { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var encode = function encode(data) {
    return JSON.stringify(data);
  };

  var decode = function decode(str) {
    return JSON.parse(str);
  };

  var getElem = function getElem(elem) {
    if (typeof elem === "string") {
      return document.getElementById(elem) || document.querySelector(elem);
    } else {
      return elem;
    }
  };

  var processRoutes = function processRoutes(routes) {
    var res = {};
    Object.keys(routes).forEach(function (name) {
      var route = routes[name];
      if (route === true) {
        res[name] = { encode: encode, decode: decode };
      } else if ((typeof route === "undefined" ? "undefined" : _typeof(route)) === "object") {
        res[name] = route;
        if (!route.encode) {
          route.encode = encode;
        }
        if (!route.decode) {
          route.decode = decode;
        }
      } else {
        res[name] = false;
      }
    });

    return res;
  };

  var Router = function () {
    function Router() {
      var routes = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref$index = _ref.index;
      var index = _ref$index === undefined ? "index" : _ref$index;
      var _ref$prefix = _ref.prefix;
      var prefix = _ref$prefix === undefined ? "page-" : _ref$prefix;
      var _ref$elem = _ref.elem;
      var elem = _ref$elem === undefined ? document.body : _ref$elem;
      var _ref$invalid = _ref.invalid;
      var invalid = _ref$invalid === undefined ? index : _ref$invalid;
      classCallCheck(this, Router);

      this.$elem = getElem(elem);
      this.prefix = prefix;
      this.index = index;
      this.invalid = invalid;
      this.routes = processRoutes(routes);
      this.names = Object.keys(routes);
      this.callbacks = { "*": [] };
      this.hashes = {};
      this.current = null;

      this.init();
    }

    createClass(Router, [{
      key: "init",
      value: function init() {
        var _this = this;

        this.genChecks();
        this.names.forEach(function (route) {
          _this.callbacks[route] = [];
          _this.hashes[route] = new RegExp("^#" + _this.getHash(route) + "$", "i");
        });

        window.addEventListener("hashchange", this);
        window.addEventListener("load", this);
      }
    }, {
      key: "genChecks",
      value: function genChecks() {
        this.rnames = new RegExp("^(" + this.names.join("|") + ")$", "i");
        this.rhashes = new RegExp("^#(" + this.names.map(this.getHash, this).join("|") + ")$", "i");
        this.rcallbacks = new RegExp("^(" + this.names.join("|") + "|\\*)$");
      }
    }, {
      key: "getHash",
      value: function getHash(route) {
        return this.routes[route] ? route + "-.*" : route;
      }
    }, {
      key: "addRoute",
      value: function addRoute(name) {
        var route = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        if (!this.rnames.test(name)) {
          this.routes[name] = route.encode && route.decode ? route : false;
          this.names.push(name);
          this.callbacks[name] = [];
          this.hashes[name] = new RegExp("^#" + this.getHash(route) + "$", "i");
          this.genChecks();
        }

        return this;
      }
    }, {
      key: "removeRoute",
      value: function removeRoute(name) {
        if (this.rnames.test(name)) {
          this.routes[name] = undefined;
          this.names.splice(this.names.indexOf(name), 1);
          this.callbacks[name] = undefined;
          this.hashes[name] = undefined;
          this.genChecks();
        }

        return this;
      }
    }, {
      key: "handleEvent",
      value: function handleEvent() {
        var _this2 = this;

        var hash = location.hash;

        if (this.rhashes.test(hash)) {
          (function () {
            var name = void 0,
                data = void 0;

            for (var i = 0, len = _this2.names.length; i < len; i++) {
              name = _this2.names[i];
              if (_this2.hashes[name].test(hash)) {
                if (_this2.routes[name]) {
                  var str = decodeURIComponent(hash.slice(name.length + 2));
                  data = _this2.routes[name].decode(str);
                }
                break;
              }
            }

            if (_this2.current) {
              _this2.$elem.classList.remove(_this2.prefix + _this2.current);
            }
            _this2.current = name;
            _this2.$elem.classList.add(_this2.prefix + name);

            _this2.callbacks[name].forEach(function (cb) {
              cb(data, hash, _this2);
            });

            _this2.callbacks["*"].forEach(function (cb) {
              cb(name, data, hash, _this2);
            });
          })();
        } else if (this.invalid) {
          location.hash = "#" + this.invalid;
        }
      }
    }, {
      key: "on",
      value: function on(name, cb) {
        if (this.rcallbacks.test(name)) {
          this.callbacks[name].push(cb);
        }

        return this;
      }
    }, {
      key: "off",
      value: function off(name, cb) {
        if (this.rcallbacks.test(name)) {
          var index = this.callbacks[name].indexOf(cb);

          if (index !== -1) {
            this.callbacks[name].splice(index, 1);
          }
        }

        return this;
      }
    }, {
      key: "go",
      value: function go(name, data) {
        if (this.rnames.test(name)) {
          if (this.routes[name]) {
            name += "-" + encodeURIComponent(this.routes[name].encode(data));
          }

          var hash = "#" + name;
          if (location.hash !== hash) {
            location.hash = hash;
          }
        }

        return this;
      }
    }]);
    return Router;
  }();

  exports.encode = encode;
  exports.decode = decode;
  exports.getElem = getElem;
  exports.processRoutes = processRoutes;
  exports['default'] = Router;

  Object.defineProperty(exports, '__esModule', { value: true });

}));