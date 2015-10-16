HOOKZ
=====

ProcessWire Hooks + Backbone.Events = hookz

### Install
Install with npm
```bash
$ npm install hookz --save
```

### Usage
```js
var hookz = require('hookz');

var hooker = {
  foo : function (hookEv) {
    console.log(hookEv.returnValue + ' boo');
  }
};

var hookable = {
  ___bar : functio () {
    return 'baz';
  }
}

hookz.call(hooker);
hookz.call(hookable);

hooker.addHook(hookable, 'bar', hooker.foo);

hooker.bar();

//=> baz boo
```

### RoadMap
- Implement before and after hooks.
- Remove underscore from dependencies.
- Create a demo app
- Update Readme, add API docs
- Add travis-ci

### Test
```bash
$ npm test
```