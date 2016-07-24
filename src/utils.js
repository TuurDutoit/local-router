export const encode = function(data) {
  try {
    return JSON.stringify(data);
  }
  catch(e) {
    console.warn("[local-router] ERROR: failed to stringify JSON data.", e, data);
    return "";
  }
}

export const decode = function(str) {
  try {
    return JSON.parse(str);
  }
  catch(e) {
    console.warn("[local-router] ERROR: failed to parse JSON data.", e, str);
    return null;
  }
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
