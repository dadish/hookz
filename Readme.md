HOOKZ
=====

This one was inspired by my favorite hooking system. The best if you will.
[Hooks API][pw-api] of the [ProcessWire CMS][pw].

ProcessWire Hooks + Backbone.Events = hookz

What this have to do with the [Backbone.Events][bb-events], you might ask. Well I believe
that the code for best hooking system I know should be written by one of the best
JavaScript coders out there. That's why I used the code for Backbone.Events and
tweaked it to behave like ProcessWire's Hooks API. I even took all the tests 
for Backbone.Events for testing this very module. And, of course, I added some 
more.

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
  ___bar : function () {
    return 'baz';
  }
}

hookz.call(hooker);
hookz.call(hookable);

hooker.addHook(hookable, 'bar', hooker.foo);

hooker.bar();

//=> baz boo
```

### API
#### Constructer
To make a JavaScript object hookable and/or hooker (being able to hook) you call
__hookz__ on it. All methods that are properly prefixed will be hookable. Then you
call the hookable methods without the prefix and trigger all attached hook methods. 

##### Example
```js
var obj = {
  ___a : function () {}
};

hookz.call(obj);

obj.a(); // This will trigger all the attached hooks

```

If you wish to call a hookable method without triggering the hooks attached to
it, then you call the method with the prefix. Like this...
```js
obj.___a(); // This will not trigger any attached hooks
```

##### Syntax
```js
hookz.call(obj [, prefix]);
```

__obj__ is an object that you want to turn into a hookz object. Which 
makes it hookable or being able to add hooks into other hookable objects.
__prefix__ (optional) The prefix that is used to determine if the method
is hookable. Default is `___` (three underscores).

> Note: The methods defined after the call on hookz will not be hookable. 
> First you define your desired object and it's methods, then you call __hookz__
> on them. If you want to define hookable methods on the runtime, you can do
> that with addHook method, see below.

#### addHook
Adds a hook on a hookable method. Every __hookz__ object has an _addHook_ method.
##### Example
```js
obj.addHook(obj, 'a', function () {
  console.log('The world is mine!');
});
 
obj.a();
// => The world is mine!
```
##### Syntax
```js
obj.addHook(obj, methodName, callback [, context]);
```

__obj__ is a hookable object. __methodName__ is a name of the method that you
want to attach hooks into. __callback__ is a function to be called. __context__
is a context for the callback. Defaults to the object that attaches a hook.

You can provide multiple names at once to attach a method to several hookable
methods. The names should be seperated with space.
```js
obj.addHook(obj, 'name1 name2 name3', function () {});
```

__hookz__ also supports a map syntax for attaching hooks, as an alternative.
```js
obj.addHook(obj, {
  name : function () {},
  name1 : function () {},
  name2 : function () {} 
});
```

You can provide a context as a third argument when you are attaching hooks via
object map syntax.
```js
obj.addHook(obj, {name : function () {}}, context);
```

If you want to add hookable methods at the runtime, you can do so with addHook
method.
```js
obj.addHook(obj, 'someName', function () {
  console.log('someName method');
});
```

If __obj__ has no method or property called 'someName' it gets one and it is also
hookable.

#### removeHook
You can remove the hooks that you have attached with __removeHook__ method.

##### Syntax
```js
obj.removeHook([obj] [, name] [, callback] [, context]);
```

You can remove all the hooks that was attached by an object if you call
__removeHook__ with no arguments. Or provide any argument to be more precise.
You even can remove hooks with map syntax.
```js
obj.removeHook(obj, {
  name1 : callback1,
  name2 : callback2
});
```

You can remove all hooks on specific context
```js
obj.removeHook(null, null, context);
```

#### addHookOnce
You can attach a hook so it fires just once with __addHookOnce__. This one 
supports all the syntax style as the __addHook__ method.

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

### License
MIT

### Credits
[Ryan Cramer][cramer], ProcessWire author
[Jeremy Ashkenas][ashkenas], Backbone author

[pw]: http://processwire.com
[pw-api]: http://processwire.com/api/hooks/
[cramer]: https://github.com/ryancramerdesign/
[ashkenas]: https://github.com/jashkenas
[bb-events]: http://backbonejs.org/#Events

