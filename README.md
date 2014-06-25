router
======
### Lightweight isomorphic router

Works both server-side in node and in browsers supporting `pushState`. The module should work with CommonJS and AMD packagers (as long as you provide the `eventemitter` dependency for the latter).

The package is not published on NPM because I'm too lazy to find a cool (and free) name.

Installation
============

Server-side :
```bash
$ npm install git+https://github.com/thibauts/router.git
```

Client-side :
```bash
$ wget https://raw.githubusercontent.com/thibauts/eventemitter/master/eventemitter.js
$ wget https://raw.githubusercontent.com/thibauts/router/master/router.js
```

Usage
=====

On the node side :
``` javascript
var Router = require('router');

var router = new Router();

router.define({
  'index': '/',
  'hello': '/hello/:name'
});

router.on('route', function(name, params) {
  console.log('route', name, params);
});

router.on('notfound', function(url) {
  console.log('not found', url);
});

router.dispatch('/foobar');
router.dispatch('/hello/world');
```

On the browser side (you will need [eventemitter](https://github.com/thibauts/eventemitter)) :
``` html
<!doctype html>
<html>
<head>
  <script src="eventemitter.js"></script>
  <script src="router.js"></script>
  <script>
    var router = new Router();

    router.define({
      'index': '/',
      'hello': '/hello/:name'
    });

    router.on('route', function(name, params) {
      console.log('route', name, params);
    });

    router.on('notfound', function(url) {
      console.log('not found', url);
    });

    router.navigate('/foobar');
    router.navigate('/hello/world');
  </script>
</head>
<body>
</body>
</html>
```