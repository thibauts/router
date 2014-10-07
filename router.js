(function() {

  // Node
  if(typeof module !== 'undefined' && module.exports) {
    var EventEmitter = require('eventemitter');
    onload(EventEmitter);
  }
  // AMD
  else if(typeof define !== 'undefined' && define.amd) {
    define(['eventemitter'], onload);
  }
  // Browser
  else {
    onload(window.EventEmitter);
  }

  function onload(EventEmitter) {

    var PARAM_PATTERN = /:([a-zA-Z0-9_]+)/g;
    var PARAM_CAPTURE = '(.*?)';

    function Router() {
      EventEmitter.call(this);

      if(typeof window !== 'undefined') {
        var self = this;
        window.addEventListener('popstate', function() {
          self.dispatch(window.location.pathname+window.location.hash);
        }, false);
      }
    }

    Router.prototype = Object.create(EventEmitter.prototype);

    Router.prototype.define = function(routes) {
      this.routes = {};

      for(routeName in routes) {
        var pattern = routes[routeName];

        var params = [];
        while(res = PARAM_PATTERN.exec(pattern)) {
          params.push(res[0]);
        }

        var regexp = pattern;
        params.forEach(function(paramName) {
          regexp = regexp.replace(paramName, PARAM_CAPTURE);
        });

        this.routes[routeName] = {
          pattern: pattern,
          regexp: '^' + regexp + '$',
          params: params.map(function(param) { return param.substring(1); }),
          name: routeName
        };
      }
    };

    Router.prototype.dispatch = function(url) {
      for(routeName in this.routes) {
        var route = this.routes[routeName];

        var matches = url.match(route.regexp);
        if(!matches) {
          continue;
        }

        var values = matches.slice(1);
        var object = {};

        route.params.forEach(function(paramName, idx) {
          object[paramName] = values[idx];
        });

        this.emit('route', routeName, object);
        return;
      }

      this.emit('notfound', url);
    };

    Router.prototype.navigate = function(url) {
      if(typeof window === 'undefined') return;
      window.history.pushState(null, null, url);
      this.dispatch(url);
    };

    // Node
    if(typeof module !== 'undefined' && module.exports) {
      module.exports = Router;
    }
    // AMD
    else if(typeof define !== 'undefined' && define.amd) {
      return Router;
    }
    // Browser
    else {
      window.Router = Router;
    }

  }

})();
