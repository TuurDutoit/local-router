import {encode, decode, getElem, processRoutes} from "./utils.js";


export default class Router {
  constructor(routes = {}, {index = "index", prefix = "page-", elem = document.body, separator = "-"} = {}) {
    this.$elem = getElem(elem);
    this.prefix = prefix;
    this.separator = separator;
    this.index = index;
    this.routes = processRoutes(routes);
    this.names = Object.keys(routes);
    this.callbacks = {"*": []};
    this.hashes = {};
    this.current = null;
    
    this.init();
  }
  
  init() {
    console.log("router");
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
    return this.routes[route] ? route + this.separator + ".*" : route;
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
      let index = hash.indexOf(this.separator);
      let name = hash.slice(1, index === -1 ? hash.length : index)
      let hasData = !!this.routes[name];
      let data;
      
      if(hasData) {
        let dataStr = hash.slice(index+1);
        data = this.routes[name].decode(dataStr || "");
      }
      console.log(name);
      
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
    else {
      location.hash = "#" + this.index;
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
        name += this.separator + encodeURIComponent(this.routes[name].encode(data));
      }
      
      let hash = "#" + name;
      if(location.hash !== hash) {
        location.hash = hash;
      }
    }
    
    return this;
  }
}
