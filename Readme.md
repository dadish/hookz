HOOKZ
=====

[![Build Status](https://travis-ci.org/dadish/hookz.svg?branch=master)](https://travis-ci.org/dadish/hookz)

This one was inspired by my favorite hooking system. The best if you will.
[Hooks API][pw-api] of the [ProcessWire CMS][pw].

ProcessWire Hooks + Backbone.Events = hookz

What this have to do with the [Backbone.Events][bb-events], you might ask. Well, I believe
that the code for best hooking system I know should be written by one of the best
JavaScript coders I am aware of. So I took the code for Backbone.Events and 
tweaked it to behave like ProcessWire's Hooks API. I even took all the tests for
Backbone.Events for testing this very module. And, of course, I added some more.

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
 
hookable.bar();

//=> baz boo
```

### API
#### Constructer
To make a JavaScript object hookable and/or hooker (being able to hook) you call
__hookz__ on it. All methods that are properly prefixed will be hookable. Then you
call the hookable methods without the prefix and trigger all attached hook methods. 
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

The syntax is:
```js
hookz.call(obj [, prefix]);
```

__obj__ is an object that you want to turn into a __hookz__ object. Which 
makes it hookable or being able to add hooks into other hookable objects.
__prefix__ (optional) is used to determine if the method is hookable.
Default is `___` (three underscores).

> Note: The methods defined after the call on hookz will not be hookable. 
> First you define your desired object and it's methods, then you call __hookz__
> on them. If you want to define hookable methods on the runtime, you can do
> that with addHook method, see below.

#### addHook
Adds a hook on a hookable method. Every __hookz__ object has an __addHook__ method.
```js
obj.addHook(obj, 'a', function () {
  console.log('The world is mine!');
});
 
obj.a();
// => The world is mine!
```

The syntax is:
```js
obj.addHook(obj, methodName, callback [, context]);
```

__obj__ is a hookable object. __methodName__ is a name of the method that you
want to attach hooks into. __callback__ is a function to be called. __context__
is a context for the callback. Defaults to the object that attaches a hook.

You can provide multiple names at once to attach a hook to several hookable
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
obj.addHook(obj, 'someName', function () {});
```

If __obj__ has no method or property called `someName` it gets one and it is also
hookable.

#### removeHook
You can remove the hooks that you have attached with __removeHook__ method.

The syntax is:
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
```js
var counter = 0;
var obj = {
  ___a : function () { return this; }
};

hookz.call(obj);

obj.addHookOnce(obj, 'a', function () {
  counter += 1;
});

obj.a().a().a().a();

console.log('counter is: ' + counter);
//=> counter is 1
```

You can also use map syntax with __addHookOnce__
```js
obj.addHookOnce(obj, {
  a : function () {},
  b : function () {}
});

// Each calback will be invoked once
```

#### AddHookBefore & AddHookAfter
If you need a specific hook to run after or before the hookable method, then
you can use __addHookAfter__ and __addHookBefore__ methods.
```js
obj.addHookBefore(obj, 'a', function () {
  console.log('the `a` method is about to run');
});
```
Both __addHookAfter__ and __addHookBefore__ support all the syntactic sugar that
the __addHook__ method does.

#### HookEvent
All attached hook callbacks get only one argument. A __HookEvent__ object.
This object is one of the key concepts of the __hookz__. It allows you to modify
the behavior of the process on the fly.

##### HookEvent.args
The __args__ property of the HookEvent contains the arguments that were passed
into hookable method when invoked.
```js
obj.addHook(obj, 'a', function (HookEvent) {
  console.log(HookEvent.args[0]);
});

obj.a('foo');
//=> foo
```

You can modify the arguments for the next hooks in the chain that were attached
into the same hookable method.
```js
obj.addHook(obj, 'a', function (HookEv) {
  console.log('callback1: ' + HookEv.args[0]);
  HookEv.args[0] = 'bar';
});

obj.addHook(obj, 'a', function (HookEv) {
  console.log('callback2: ' + HookEv.args[0]);
});

obj.a('foo');

//=> callback1: foo
//=> callback2: bar
```

With the before hooks are be able to modify the arguments of the hookable
method before it is invoked.
```js
var obj = {
  ___a : function (arg) {
    console.log(arg);
  }
};

hookz.call(obj);

obj.addHookBefore(obj, 'a', function (hookEv) {
  hookEv.args[0] = 'bar';
});

obj.a('foo');

//=> bar
```

##### HookEvent.returnValue
Another useful property that __HookEvent__ has is a __returnValue__ property.
Now you can access the value returned by hookable method within all hooks that
were attached to it.
```js
var obj = {
  ___a : function () { return 'foo'; }
};

hookz.call(obj);

obj.addHookAfter(obj, 'a', function (HookEv) {
  console.log('obj.a returns ' + HookEv.returnValue);
});

obj.a();

//=> obj.a returns foo
```

Even more, you can change the returned value of the hookable method with the
attached hook.
```js
var obj = {
  ___a : function () { return 'The world is'; }
};

hookz.call(obj);

obj.addHookAfter(obj, 'a', function (HookEv) {
  HookEv.returnValue += ' mine!';
});

console.log(obj.a());

//=> The world is mine!;

```

##### HookEvent.obj
__obj__ is another useful property of __HookEvent__. You can access the object
into which the hook was attached to via `HookEvent.obj`.
```js
var hooker = {};
var hookable = {
  ___a : function () {}
};

hookz.call(hooker);
hookz.call(hookable);

hooker.addHook(hookable, 'a', function (HookEv) {
  console.log(HookEv.obj === hookable);
  console.log(this === hooker);
});

hookable.a();
//=> true
//=> true

```
> Remember? The default context for the callback is the object that attaches
> the hook.

### Coming Soon
- Replace hooks.
- Remove underscore from dependencies.
- A demo app
- Thorough API docs

### Test
The test files are not included into the npm package. You need to clone the
repo to your machine.
```bash
$ git clone https://github.com/dadish/hookz.git
$ cd hookz
$ npm install
$ npm test
```

### License
[MIT][license]

### Credits
- [Ryan Cramer][cramer], ProcessWire author
- [Jeremy Ashkenas][ashkenas], Backbone author

[pw]: http://processwire.com
[pw-api]: http://processwire.com/api/hooks/
[cramer]: https://github.com/ryancramerdesign/
[ashkenas]: https://github.com/jashkenas
[bb-events]: http://backbonejs.org/#Events
[license]: https://raw.githubusercontent.com/dadish/hookz/master/LICENSE
