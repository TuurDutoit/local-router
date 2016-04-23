export default class Router {
  constructor({routes = {}, defaultRoute, prefix = "mode-"} = {}) {
    this.$body = document.body;
    this.prefix = prefix;
    this.defaultRoute = defaultRoute;
    this.routes = routes;
    this._routes = Object.keys(routes);
    this.rroutes = new RegExp(`^(${this._routes.join("|")})$`, "i");
    this.rhashes = new RegExp(`^#(${this._routes.map(this.getHash, this).join("|")})$`, "i");
    this.rcallbacks = new RegExp(`^(${this._routes.join("|")}|\\*)$`);
    this.allClasses = this._routes.map(route => this.prefix + route);
    this.callbacks = {"*": []};
    this.checks = {};
    this.classes = {};

    if(!this.defaultRoute && this._routes.length) {
      this.defaultRoute = this._routes[0];
    }

    this.init();
  }

  init() {
    // Prep callbacks, checks and classes objects
    this._routes.forEach(route => {
      this.callbacks[route] = [];
      this.checks[route] = new RegExp(`^#${this.getHash(route)}$`, "i");
      this.classes[route] = this.prefix + route;
    });

    window.addEventListener("hashchange", this);
    window.addEventListener("load", this);
  }

  getHash(route) {
    return this.routes[route] ? route + "-.*" : route;
  }

  handleEvent(e) {
    if(this.rhashes.test(location.hash)) {
      let route;
      let str;

      for(let i = 0, len = this._routes.length; i < len; i++) {
        route = this._routes[i];
        if(this.checks[route].test(location.hash)) {
            if(this.routes[route]) {
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
    }
    else {
      location.hash = "#" + this.defaultRoute;
    }
  }

  on(route, cb) {
    if(this.rcallbacks.test(route)) {
      this.callbacks[route].push(cb);
    }

    return this;
  }

  off(route, cb) {
    if(this.rcallbacks.test(route)) {
      let index = this.callbacks[route].indexOf(cb);

      if(index !== -1) {
        this.callbacks[route].splice(index, 1);
      }
    }

    return this;
  }

  go(route, str) {
    if(this.rroutes.test(route)) {
      if(this.routes[route]) {
        route += "-" + (str ? encodeURIComponent(str) : "");
      }

      let hash = "#" + route;
      if(location.hash !== hash) {
        location.hash = hash;
      }
    }

    return this;
  }
}
