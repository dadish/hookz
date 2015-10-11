var Hookz = require("../");
var HookEvent = require('../HookEvent');
var Assert = require('assert');
var _ = require('underscore');

/**
 * Glossary
 * hookMethod - Is a function that is passed as a callback argument that is
 *              invoked when a hookableMethod is called
 * hookableMethod - Is a method of the object that is hookable by other objects
 * 
 * hookObject - An object that hooks into other object that has hookableMethod/s
 * hookableObject - An object that has a hookableMthod/s
 * 
 * HookEvent - is an object which ia an only argument that is given to hookMethod
 */

describe('Hookz', function () {
  
  it("returns it's object", function () {
    var hooker = {};

    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; }
    };
    Assert.strictEqual(hooker, Hookz.call(hooker));
    Assert.strictEqual(hookable, Hookz.call(hookable));
  });

  it("hookMethod is called with only one argument, that is a HookEvent object", function () {
    var hooker = {};

    var hookable = {
      ___a : function () { return this; }
    };

    var callback = function (hookEv) {
      Assert(hookEv instanceof HookEvent);
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    hooker.addHook(hookable, 'a', callback);
    hookable.a();
  });

  context("HookEvent's args property", function () {
    var hooker = {};

    var hookable = {
      ___a : function () { return this; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    it("HookEvent has an `arguments` property which is an Array", function () {
      var callback = function (hookEv) {
        Assert(_.isArray(hookEv.args));
      };
      hooker.addHookOnce(hookable, 'a', callback);
      hookable.a();
    });

    it("HookEvent's `arguments` property contains all arguments passed into hookableMethod when invoked", function () {
      var a = 'boo', b = {}, c = 1234; d = new HookEvent();
      var callback = function (hookEv) {
        var args = hookEv.args;
        Assert.strictEqual(args[0], a);
        Assert.strictEqual(args[1], b);
        Assert.strictEqual(args[2], c);
        Assert.strictEqual(args[3], d);
      }
      hooker.addHookOnce(hookable, 'a', callback);
      hookable.a(a, b, c, d);
    });

    it("All items in HookEvent's `arguments` property could be modified for the next hookMethod in chain", function () {
      var a = 'boo', b = {}, c = 1234; d = new HookEvent();
      var a1 = {}, b1 = 'boo', c1 = 334; d1 = new Hookz();
      var callback1 = function (hookEv) {
        var args = hookEv.args;
        args[0] = a1;
        args[1] = b1;
        args[2] = c1;
        args[3] = d1;
      }
      var callback2 = function (hookEv) {
        var args = hookEv.args;
        Assert.strictEqual(args[0], a1);
        Assert.strictEqual(args[1], b1);
        Assert.strictEqual(args[2], c1);
        Assert.strictEqual(args[3], d1);
      }
      hooker.addHookOnce(hookable, 'a', callback1);
      hooker.addHookOnce(hookable, 'a', callback2);
      hookable.a(a, b, c, d);
    });
  });

  it("HookEvent has an `obj` property that references the object that owns the hookableMethod", function () {
    var hooker = {};

    var hookable = {
      ___a : function () { return this; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function (hookEv) {
      Assert.strictEqual(hookable, hookEv.obj);
    }
    hooker.addHookOnce(hookable, 'a', callback);
    hookable.a();
  });

  it("HookEvent has a `returnValue` property that is a value returned by hookableMethod", function () {
    var hooker = {};

    var hookable = {
      ___a : function () { return 'boo'; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function (hookEv) {
      Assert.strictEqual(hookEv.returnValue, 'boo');
    }
    hooker.addHookOnce(hookable, 'a', callback);
    hookable.a();
  });

  it("The `returnValue` property of the HookEvent object could be modified for the next hookMethod in chain", function () {
    var hooker = {};

    var hookable = {
      ___a : function () { return 'boo'; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback1 = function (hookEv) {
      Assert.strictEqual(hookEv.returnValue, 'boo');
      hookEv.returnValue = 'zoo';
    }
    var callback2 = function (hookEv) {
      Assert.strictEqual(hookEv.returnValue, 'zoo');
    }
    hooker.addHookOnce(hookable, 'a', callback1);
    hooker.addHookOnce(hookable, 'a', callback2);
    hookable.a();
  });

  it("The returned value of the hookableMethod is the last value of `returnValue` property of HookEvent object", function () {
    var hooker = {};

    var hookable = {
      ___a : function () { return 'boo'; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function (hookEv) {
      Assert.strictEqual(hookEv.returnValue, 'boo');
      hookEv.returnValue = 'zoo';
    }
    hooker.addHookOnce(hookable, 'a', callback);
    Assert.strictEqual(hookable.a(), 'zoo');
  });

  it("HookEvent has a `replace` property, which if set to true the hookMethod will be invoked instead of hookableMethod");

  it("Adds a method into an object if the hookableMethod does not exist yet");

  it("Methods added via addHook are also hookable");

  it("cannot hook into methods that are not properly prefixed", function () {
    var hooker = { counter : 0};

    var hookable = {
      ___a : function () { return this; },
      b : function () { return this; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function (hookEv) {
      hooker.counter += 1;
    }
    hooker.addHook(hookable, 'a', callback);
    hooker.addHook(hookable, 'b', callback);
    hookable.a().b().a().b();
    Assert.strictEqual(hooker.counter, 2);
  });

});