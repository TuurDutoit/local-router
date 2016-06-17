export const encode = function(data) {
  return JSON.stringify(data);
}

export const decode = function(str) {
  return JSON.parse(str);
}

export const getElem = function(elem) {
  if(typeof elem === "string") {
    return document.getElementById(elem) || document.querySelector(elem);
  }
  else {
    return elem;
  }
}

export const processRoutes = function(routes) {
  let res = {};
  Object.keys(routes).forEach(name => {
    let route = routes[name];
    if(route === true) {
      res[name] = {encode, decode};
    }
    else if(typeof route === "object") {
      res[name] = route;
      if(!route.encode) {
        route.encode = encode;
      }
      if(!route.decode) {
        route.decode = decode;
      }
    }
    else {
      res[name] = false;
    }
  });
  
  return res;
}



export default class Router {
  constructor(routes = {}, {index = "index", prefix = "page-", elem = document.body, invalid = index} = {}) {
    this.$elem = getElem(elem);
    this.prefix = prefix;
    this.index = index;
    this.invalid = invalid;
    this.routes = processRoutes(routes);
    this.names = Object.keys(routes);
    this.callbacks = {"*": []};
    this.hashes = {};
    this.current = null;
    
    this.init();
  }
  
  init() {
    this.genChecks();
    this.names.forEach(route => {
      this.callbacks[route] = [];
      this.hashes[route] = new RegExp(`^#${this.getHash(route)}$`, "i");
    });
    
    window.addEventListener("hashchange", this);
    window.addEventListener("load", this);
  }
  
  genChecks() {
    this.rnames = new RegExp(`^(${this.names.join("|")})$`, "i");
    this.rhashes = new RegExp(`^#(${this.names.map(this.getHash, this).join("|")})$`, "i");
    this.rcallbacks = new RegExp(`^(${this.names.join("|")}|\\*)$`);
  }
  
  getHash(route) {
    return this.routes[route] ? route + "-.*" : route;
  }
  
  addRoute(name, route = false) {
    if(!this.rnames.test(name)) {
      this.routes[name] = (route.encode && route.decode) ? route : false;
      this.names.push(name);
      this.callbacks[name] = [];
      this.hashes[name] = new RegExp(`^#${this.getHash(route)}$`, "i");
      this.genChecks();
    }
    
    return this;
  }
  
  removeRoute(name) {
    if(this.rnames.test(name)) {
      this.routes[name] = undefined;
      this.names.splice(this.names.indexOf(name), 1);
      this.callbacks[name] = undefined;
      this.hashes[name] = undefined;
      this.genChecks();
    }
    
    return this;
  }
  
  handleEvent() {
    let hash = location.hash;
    
    if(this.rhashes.test(hash)) {
      let name, data;
      
      for(let i = 0, len = this.names.length; i < len; i++) {
        name = this.names[i];
        if(this.hashes[name].test(hash)) {
          if(this.routes[name]) {
            let str = decodeURIComponent( hash.slice(name.length + 2) );
            data = this.routes[name].decode(str);
          }
          break;
        }
      }
      
      if(this.current) {
        this.$elem.classList.remove(this.prefix + this.current);
      }
      this.current = name;
      this.$elem.classList.add(this.prefix + name);
      
      this.callbacks[name].forEach(cb => {
        cb(data, hash, this);
      });
      
      this.callbacks["*"].forEach(cb => {
        cb(name, data, hash, this);
      });
    }
    else if(this.invalid) {
      location.hash = "#" + this.invalid;
    }
  }
  
  on(name, cb) {
    if(this.rcallbacks.test(name)) {
      this.callbacks[name].push(cb);
    }
    
    return this;
  }
  
  off(name, cb) {
    if(this.rcallbacks.test(name)) {
      let index = this.callbacks[name].indexOf(cb);
      
      if(index !== -1) {
        this.callbacks[name].splice(index, 1);
      }
    }
    
    return this;
  }
  
  go(name, data) {
    if(this.rnames.test(name)) {
      if(this.routes[name]) {
        name += "-" + encodeURIComponent(this.routes[name].encode(data));
      }
      
      let hash = "#" + name;
      if(location.hash !== hash) {
        location.hash = hash;
      }
    }
    
    return this;
  }
}
