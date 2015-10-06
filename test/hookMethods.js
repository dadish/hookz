var Hookz = require("../");
var Assert = require('assert');
var sinon = require('sinon');
var _ = require('underscore');

describe('addHook, addHookOnce, removeHook', function () {

  context("trigger methods", function () {
    
    var hookable = {
      counter : 0, 
      ___hookableMethod : function () {
        this.counter += 1;
        Assert.strictEqual(this, hookable);
        return this;
      }
    };

    Hookz.call(hookable);    

    it("the context of the trigger methods should be the hookable object", function () {
      hookable.hookableMethod().hookableMethod();
      Assert.strictEqual(hookable.counter, 2);  
    });
  });

  context("hooking and triggering", function() {
    var hookable = { 
      ___hookableMethod : function () {}
    };
    
    var hooker = {counter: 0};

    Hookz.call(hookable);
    Hookz.call(hooker);
    
    hooker.addHook(hookable, 'hookableMethod', function() { 
      hooker.counter += 1; 
    });

    it('counter should be incremented.', function () {
      hookable.hookableMethod();
      Assert.strictEqual(hooker.counter, 1);
    });

    it('counter should be incremented five times.', function () {
      hookable.hookableMethod();
      hookable.hookableMethod();
      hookable.hookableMethod();
      hookable.hookableMethod();
      Assert.strictEqual(hooker.counter, 5);
    });   
  });

  context("hooking multiple times into one method", function () {
    var hooker = { counter: 0 };
    var hookable = { 
      ___a : function () {},
      ___b : function () {},
      ___c : function () {}
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    it("counter should be incremented two times.", function () {
      hooker.addHook(hookable, 'a', function () { hooker.counter += 1; });
      hooker.addHook(hookable, 'a', function () { hooker.counter += 1; });
      
      hookable.a();
      Assert.strictEqual(hooker.counter, 2);
    });

    it("counter should be incremented five times.", function () {
      hooker.addHook(hookable, 'a', function () { hooker.counter += 1; });
      hookable.a()
      Assert.strictEqual(hooker.counter, 5);      
    });
    
  });

  context("hooking and triggering multiple events", function() {
    var hooker = { counter: 0 };
    var hookable = { 
      ___a : function () {},
      ___b : function () {},
      ___c : function () {}
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    hooker.addHook(hookable, 'a b c', function() { hooker.counter += 1; });

    it("counter should be incremented.", function () {
      hookable.a();
      Assert.strictEqual(hooker.counter, 1);      
    });

    it("counter should be incremented three times.", function () {
      hookable.a();
      hookable.b();
      Assert.strictEqual(hooker.counter, 3);      
    });

    it("counter should be incremented four times.", function () {
      hookable.c();
      Assert.strictEqual(hooker.counter, 4);      
    });

    it("counter should be incremented five times.", function () {
      hooker.removeHook(hookable, 'a c');
      hookable.a();
      hookable.b();
      hookable.c();
      Assert.strictEqual(hooker.counter, 5);      
    });

  });

  context("hooking and triggering with method maps", function() {
    var hooker = { counter: 0 };
    var hookable = {
      ___a : function () {},
      ___b : function () {},
      ___c : function () {}
    };
    Hookz.call(hooker);
    Hookz.call(hookable);

    var increment = function() {
      hooker.counter += 1;
    };

    hooker.addHook(hookable, {
      a: increment,
      b: increment,
      c: increment
    });

    it("counter should be incremented.", function () {
      hookable.a();
      Assert.strictEqual(hooker.counter, 1);      
    });

    it("counter should be incremented three times.", function () {
      hookable.a();
      hookable.b();
      Assert.strictEqual(hooker.counter, 3);      
    });

    it("counter should be incremented four times.", function () {
      hookable.c();
      Assert.strictEqual(hooker.counter, 4);      
    });

    it("counter should be incremented five times.", function () {
      hooker.removeHook(hookable, {
        a: increment,
        c: increment
      });
      hookable.a();
      hookable.b();
      hookable.c();
      Assert.strictEqual(hooker.counter, 5);      
    });
  });

  context("hooking and triggering multiple methods with event maps", function() {
    var hooker = { counter: 0 };
    var hookable = {
      ___a : function () {},
      ___b : function () {},
      ___c : function () {}
    };
    Hookz.call(hooker);
    Hookz.call(hookable);

    var increment = function() {
      hooker.counter += 1;
    };

    hooker.addHook(hookable, {
      'a b c': increment
    });

    it("counter should be incremented.", function () {
      hookable.a();
      Assert.strictEqual(hooker.counter, 1);
    });

    it("counter should be incremented three times", function () {
      hookable.a();
      hookable.b();
      Assert.strictEqual(hooker.counter, 3);
    });

    it("counter should be incremented four times.", function () {
      hookable.c();
      Assert.strictEqual(hooker.counter, 4);      
    });

    it("counter should be incremented five times.", function () {
      hooker.removeHook(hookable, {
        'a c': increment
      });
      hookable.a();
      hookable.b();
      hookable.c();
      Assert.strictEqual(hooker.counter, 5);      
    });
  });

  context("the hookMethod context", function() {
    var ctx = {};
    var hooker = { counter: 0 };
    var hookable = {
      ___a : function () {},
      ___b : function () {},
      ___c : function () {}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("defaults to `hooker`", function () {
      hooker.addHook(hookable, 'a', function () {
        Assert.strictEqual(this, hooker);
      });
      hookable.a();
      hooker.removeHook();
    });

    it("defaults to `hooker` when hooked into multiple methods.", function () {
      hooker.addHook(hookable, 'a b', function () {
        Assert.strictEqual(this, hooker);
      });
      hookable.a();
      hookable.b();
      hooker.removeHook();
    });

    it("can be set as a fourth argument", function () {
      hooker.addHook(hookable, 'a b', function () {
        Assert.strictEqual(this, ctx);
      }, ctx);
      hookable.a();
      hookable.b();
      hooker.removeHook();
    });

    it("can be set as a third argument when hooked as a hooks map", function () {
      hooker.addHook(hookable, {
        a : function () {
          Assert.strictEqual(this, ctx);
        }
      }, ctx);
      hookable.a();
      hooker.removeHook();
    });

    it("is set for all hookMethods when set as a third argument when hooked as a hooks map", function () {
      hooker.addHook(hookable, {
        a : function () {
          Assert.strictEqual(this, ctx);
        },
        b : function () {
          Assert.strictEqual(this, ctx);
        },        
        c : function () {
          Assert.strictEqual(this, ctx);
        }
      }, ctx);
      hookable.a();
      hookable.b();
      hookable.c();
      hooker.removeHook();
    });

    it("if set as a fourth argument when hooked as a hooks map, third argument should not overwrite it.", function () {
      hooker.addHook(hookable, {
        a : function () {
          Assert.strictEqual(this, ctx);
        }
      }, hooker, ctx);
      hookable.a();
      hooker.removeHook();
    });

  });

  context("removing hooks", function() {
    var hooker = { 
      counter1 : 0 ,
      counter2 : 0
    };
    var hookable = {
      ___a : function () {},
      ___b : function () {},
      ___c : function () {}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback1 = function () {
      hooker.counter1 += 1;
    };

    var callback2 = function () {
      hooker.counter2 += 1;
    };

    it("removes hooks with #removeHook() method", function () {

      hooker.addHook(hookable, 'a', callback1);
      hooker.addHook(hookable, 'a', callback2);
      hookable.a();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 1);
      hooker.removeHook(hookable, 'a', callback1);
      hookable.a();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 2);
      hooker.removeHook(hookable, 'a', callback2);
      hookable.a();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 2);
    });

    it("removes all hooks for given method if callback is not provided", function () {
      var called1 = false, called2 = false, called3 = false;
      var callback1 = function () { called1 = true; };
      var callback2 = function () { called2 = true; };
      var callback3 = function () { called3 = true; };
      hooker.addHook(hookable, 'a', callback1);
      hooker.addHook(hookable, 'a', callback2);
      hooker.addHook(hookable, 'b', callback3);

      hooker.removeHook(hookable, 'a');

      hookable.a();
      hookable.b();
      Assert.strictEqual(called1, false);
      Assert.strictEqual(called2, false);
      Assert.strictEqual(called3, true);
    });
  });

  context("removing hooks with hook maps", function() {
    var hooker = { 
      counter1 : 0 ,
      counter2 : 0
    };
    var hookable = {
      ___a : function () {},
      ___b : function () {},
      ___c : function () {}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback1 = function () {
      hooker.counter1 += 1;
    };

    var callback2 = function () {
      hooker.counter2 += 1;
    };

    it("counter1 should be 1.", function () {
      hooker.addHook(hookable, {a : callback1});
      hookable.a();
      Assert.strictEqual(hooker.counter1, 1);      
    });
    
    it("counter2 should be 1.", function () {
      hooker.addHook(hookable, {b : callback2});
      hookable.b();
      Assert.strictEqual(hooker.counter2, 1);      
    });
    
    it("counter1 should be 2, counter2 should be 1.", function () {
      hooker.removeHook(hookable, {b : callback2});
      hookable.a();
      hookable.b();
      Assert.strictEqual(hooker.counter1, 2);
      Assert.strictEqual(hooker.counter2, 1);      
    });
    
    it("counter2 should be 2, counter2 should be 1.", function () {
      hooker.removeHook();
      hookable.a();
      hookable.b();
      Assert.strictEqual(hooker.counter1, 2);
      Assert.strictEqual(hooker.counter2, 1);      
    });
  });

  context("removing hooks with omitted args", function () {
    var hooker = { 
      counter1 : 0 ,
      counter2 : 0
    };
    var hookable = {
      ___a : function () {},
      ___b : function () {},
      ___c : function () {}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback1 = function () {
      hooker.counter1 += 1;
    };

    var callback2 = function () {
      hooker.counter2 += 1;
    };

    it("counter1 should be 0, counter2 should be 1", function () {
      hooker.addHook(hookable, 'a', callback1);
      hooker.addHook(hookable, 'b', callback2);
      hooker.removeHook(null, {a : callback1});
      hookable.a();
      hookable.b();
      Assert.strictEqual(hooker.counter1, 0);
      Assert.strictEqual(hooker.counter2, 1);      
    });
    
    it("counter1 should be 1, counter2 should be 1", function () {
      hooker.addHook(hookable, 'a b', callback1);
      hookable.a();
      hooker.removeHook(null, 'a');
      hooker.removeHook();
      hookable.b();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 1);      
    });
  });

  context("addHookOnce", function() {
    var hooker = { 
      counter1 : 0 ,
      counter2 : 0
    };
    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; },
      ___c : function () { return this; }
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback1 = function () { hooker.counter1 += 1; };
    var callback2 = function () { hooker.counter2 += 1; };

    it("hooked methods should run just once", function () {
      hooker.addHookOnce(hookable, 'a', callback1);
      hooker.addHookOnce(hookable, 'b', callback2);
      hookable.a().a().a();
      hookable.b().b().b().b();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 1);
    });

    it("hookable methods can be removed", function() {
      hooker.removeHook();
      hooker.counter1 = 0;
      hooker.counter2 = 0;
      hooker.addHookOnce(hookable, 'a', callback1);
      hookable.a().a();
      hooker.addHookOnce(hookable, 'b', callback2);
      hooker.removeHook();
      hookable.a().b();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 0);
    });

    it("addHook, addHookOnce and removeHook", function() {
      hooker.removeHook();
      hooker.counter1 = 0;
      hooker.counter2 = 0;
      hooker.addHookOnce(hookable, 'a', callback1);
      hookable.a().a();
      hooker.addHook(hookable, 'a', callback1);
      hooker.removeHook();
      hookable.a().a();
      Assert.strictEqual(hooker.counter1, 1);
    });
  });

  context("addHook and removeHook with hook maps", function() {
    var hooker = { 
      counter1 : 0 ,
      counter2 : 0
    };
    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; },
      ___c : function () { return this; }
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback1 = function () { hooker.counter1 += 1; };
    var callback2 = function () { hooker.counter2 += 1; };

    it("counter1 should be 1, counter2 should be 0", function () {
      hooker.addHook(hookable, {a : callback1});
      hookable.a();
      hooker.addHook(hookable, {a : callback2});
      hooker.removeHook();
      hookable.a();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 0);      
    });
  });

  context("addHook to yourself", function(){
    var hookable = {
      counter1 : 0,
      counter2 : 0,
      ___a : function () { return this; },
      ___b : function () { return this; }
    };
    
    Hookz.call(hookable);

    var callback1 = function () { hookable.counter1 += 1; };
    var callback2 = function () { hookable.counter2 += 1; };

    it("counter1 should be 2, counter2 should be 1", function () {
      hookable.addHook(hookable, 'a', callback1);
      hookable.addHook(hookable, 'b', callback2);
      hookable.a().a().b();
      Assert.strictEqual(hookable.counter1, 2);
      Assert.strictEqual(hookable.counter2, 1);      
    });

    it("addHook yourself cleans yourself up with removeHook", function(){
      hookable.counter1 = 0;
      hookable.counter2 = 0;
      hookable.removeHook();
      hookable.addHook(hookable, 'a', callback1);
      hookable.addHook(hookable, 'b', callback1);
      hookable.addHook(hookable, 'b', callback2);
      hookable.a().b();
      hookable.removeHook();
      hookable.a().a().b().b();
      Assert.strictEqual(hookable.counter1, 2);
      Assert.strictEqual(hookable.counter2, 1);
    });
  });


  context("removeHook cleans up references", function() {
    var hooker = {};

    var hookable = {
      ___a : function () {}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function () {};

    it("without arguments", function () {
      hooker.addHook(hookable, 'a', callback);
      Assert.strictEqual(_.size(hooker._listeningTo), 1);
      Assert.strictEqual(_.size(hookable._listeners), 1);
      hooker.removeHook();
      Assert.strictEqual(_.size(hooker._listeningTo), 0);
      Assert.strictEqual(_.size(hookable._listeners), 0);
    });
    
    it("without one arguments", function () {
      hooker.addHook(hookable, 'a', callback);
      Assert.strictEqual(_.size(hooker._listeningTo), 1);
      Assert.strictEqual(_.size(hookable._listeners), 1);
      hooker.removeHook(hookable);
      Assert.strictEqual(_.size(hooker._listeningTo), 0);
      Assert.strictEqual(_.size(hookable._listeners), 0);
    });

    it("without two arguments", function () {
      hooker.addHook(hookable, 'a', callback);
      Assert.strictEqual(_.size(hooker._listeningTo), 1);
      Assert.strictEqual(_.size(hookable._listeners), 1);
      hooker.removeHook(hookable, 'a');
      Assert.strictEqual(_.size(hooker._listeningTo), 0);
      Assert.strictEqual(_.size(hookable._listeners), 0);
    });

    it("without three arguments", function () {
      hooker.addHook(hookable, 'a', callback);
      Assert.strictEqual(_.size(hooker._listeningTo), 1);
      Assert.strictEqual(_.size(hookable._listeners), 1);
      hooker.removeHook(hookable, 'a', callback);
      Assert.strictEqual(_.size(hooker._listeningTo), 0);
      Assert.strictEqual(_.size(hookable._listeners), 0);
    });

  });

  context("removeHook cleans up references from addHookOnce", function() {
    var hooker = {};

    var hookable = {
      ___a : function () {}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function () {};

    it("without arguments", function () {
      hooker.addHookOnce(hookable, 'a', callback);
      Assert.strictEqual(_.size(hooker._listeningTo), 1);
      Assert.strictEqual(_.size(hookable._listeners), 1);
      hooker.removeHook();
      Assert.strictEqual(_.size(hooker._listeningTo), 0);
      Assert.strictEqual(_.size(hookable._listeners), 0);
    });
    
    it("without one arguments", function () {
      hooker.addHookOnce(hookable, 'a', callback);
      Assert.strictEqual(_.size(hooker._listeningTo), 1);
      Assert.strictEqual(_.size(hookable._listeners), 1);
      hooker.removeHook(hookable);
      Assert.strictEqual(_.size(hooker._listeningTo), 0);
      Assert.strictEqual(_.size(hookable._listeners), 0);
    });

    it("without two arguments", function () {
      hooker.addHookOnce(hookable, 'a', callback);
      Assert.strictEqual(_.size(hooker._listeningTo), 1);
      Assert.strictEqual(_.size(hookable._listeners), 1);
      hooker.removeHook(hookable, 'a');
      Assert.strictEqual(_.size(hooker._listeningTo), 0);
      Assert.strictEqual(_.size(hookable._listeners), 0);
    });

    it("without three arguments", function () {
      hooker.addHookOnce(hookable, 'a', callback);
      Assert.strictEqual(_.size(hooker._listeningTo), 1);
      Assert.strictEqual(_.size(hookable._listeners), 1);
      hooker.removeHook(hookable, 'a', callback);
      Assert.strictEqual(_.size(hooker._listeningTo), 0);
      Assert.strictEqual(_.size(hookable._listeners), 0);
    });
  });

  context("addHookOnce cleans up references after the hookMethod has fired", function() {
    var hooker = {};

    var hookable = {
      ___a : function () {},
      ___b : function () {}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback1 = function () {};
    var callback2 = function () {};

    it("without context ", function () {
      hooker.addHookOnce(hookable, 'a', callback1);
      hookable.a();
      Assert.strictEqual(_.size(hooker._listeningTo), 0);
      Assert.strictEqual(_.size(hookable._listeners), 0);
    });

    it("with hook maps", function() {
      hooker.addHookOnce(hookable, {
        a : callback1,
        b : callback2
      });
      hookable.a();
      Assert.strictEqual(_.size(hooker._listeningTo), 1);
      Assert.strictEqual(_.size(hookable._listeners), 1);
      hookable.b();
      Assert.strictEqual(_.size(hooker._listeningTo), 0);
      Assert.strictEqual(_.size(hookable._listeners), 0);
    });

    it("with hook maps binds the correct `this`", function() {
      hooker.addHookOnce(hookable, {
        a : function () { Assert.strictEqual(hooker, this)}
      });
      hookable.a();
    });
  });

  context("addHook, addHookOnce with", function(){
    var hooker = {};

    var hookable = {
      ___a : function () {return this;},
      ___b : function () {}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("empty callback doesn't throw an error", function () {
      hooker.addHook(hookable, 'a', null);
      hooker.addHookOnce(hookable, 'b', null);
      hookable.a().b();      
    });
  });

  context("hook two callbacks, remove only one", function() {
    var hooker = {
      counter1 : 0,
      counter2 : 0
    };

    var hookable = {
      ___a : function () {},
      ___b : function () {}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback1 = function () { hooker.counter1 += 1; };
    var callback2 = function () { hooker.counter2 += 1; };

    hooker.addHook(hookable, 'a', callback1);
    hooker.addHook(hookable, 'b', callback1);
    hooker.addHook(hookable, 'b', callback2);

    it("counter1 should be 2, counter2 should be 1", function () {
      hookable.a();
      hookable.b();
      Assert.strictEqual(hooker.counter1, 2);
      Assert.strictEqual(hooker.counter2, 1);
    });

    it("counter1 should be 1, counter2 should be 1", function () {
      hooker.counter1 = 0;
      hooker.counter2 = 0;
      hooker.removeHook(hookable, 'b', callback1);
      hookable.a();
      hookable.b();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 1);
    });
  });

  context("remove a hook in the midst of it firing", function() {
    var hooker = {
      counter1 : 0,
      counter2 : 0
    };

    var hookable = {
      ___a : function () { return this; }
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback1 = function () { hooker.counter1 += 1; hooker.removeHook(hookable, 'a', callback1)};
    var callback2 = function () { hooker.counter2 += 1; hooker.removeHook(hookable, 'a', callback2)};

    it("the hook should have been unbound, counter should be 1", function () {
      hooker.addHook(hookable, 'a', callback1);
      hookable.a().a().a();
      Assert.strictEqual(hooker.counter1, 1);
    });

    it("the two hooks should have been unbound, counter1 should be 1, counter2 should be 1", function () {
      hooker.counter1 = 0;
      hooker.counter2 = 0;
      hooker.addHook(hookable, 'a', callback1);
      hooker.addHook(hookable, 'a', callback2);
      hookable.a().a().a();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 1);
    });
  });

  context("hook a callback with a supplied context", function () {
    var TestClass = function () {
      this.counter = 0;
      return this;
    };
    TestClass.prototype.assertTrue = function () {
      this.counter += 1;
    };

    var hooker = {
      counter1 : 0,
      counter2 : 0
    };

    var hookable = {
      ___a : function () { return this; }
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("counter should be 3", function () {
      var testContext = (new TestClass);
      hooker.addHook(hookable, 'a', function () { this.assertTrue() }, testContext);
      hookable.a().a().a();
      Assert.strictEqual(testContext.counter, 3);      
    });
  });

  context("nested trigger with unbind", function () {
    var hooker = {
      counter : 0
    };

    var hookable = {
      ___a : function () {}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback1 = function () { hooker.counter += 1; hooker.removeHook(hookable, 'a', callback1); hookable.a()};
    var callback2 = function () { hooker.counter += 1; };

    it("counter should be incremented three times", function () {
      hooker.addHook(hookable, 'a', callback1);
      hooker.addHook(hookable, 'a', callback2);
      hookable.a();
      Assert.strictEqual(hooker.counter, 3);
    });
  });



  context("callback list is not altered during trigger", function () {
    var hooker = {
      counter : 0
    };

    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; }
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function(){ hooker.counter++; };
    var callbackOn = function(){ hooker.addHook(hookable, 'a', callback); };
    var callbackOff = function(){ hooker.removeHook(hookable, 'a', callback); };

    it("a hook that is added during a trigger does not fire until the next trigger", function () {
      hooker.addHook(hookable, 'a', callbackOn);
      hooker.addHook(hookable, 'a', callbackOn);
      hooker.addHook(hookable, 'a', callbackOn);
      hooker.addHook(hookable, 'a', callbackOn);
      // ...
      hookable.a();
      Assert.strictEqual(hooker.counter, 0);
    });

    it("a hook that is removed during a trigger fires once before it is removed", function () {
      hooker.removeHook();
      hooker.addHook(hookable, 'a', callbackOff);
      hooker.addHook(hookable, 'a', callback);
      hookable.a();
      Assert.strictEqual(hooker.counter, 1);      
    });
  });

  context("callback list is retrieved after each event.", function() {
    var hooker = {
      counter : 0
    };

    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; }
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function(){ 
      hooker.counter++; 
      hooker.addHook(hookable, 'a', callback);
    };

    it("counter should be 3", function () {
      hooker.addHook(hookable, 'a', callback);
      hookable.a().a();
      Assert.strictEqual(hooker.counter, 3);
    });
  });

  context("if no callback is provided, `addHook` is a noop", function() {
    var hooker = {};

    var hookable = {
      ___a : function () { return this; }
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("nothing should happen", function () {
      hooker.addHook(hookable, 'a');
      hookable.a().a().a();
    });
  });

  context("if callback is truthy but not a function, then `addHook`", function() {
    var hooker = {};

    var hookable = {
      ___a : function () { return this; }
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("should throw an error", function () {
      hooker.addHook(hookable, 'a', 'noop');  
      Assert.throws(function () {
        hookable.a()
      }, Error);
    });
  });

  context("remove all events for a specific context", function() {
    var hooker = { counter : 0 }, ctx = {};

    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; }
    };

    var callback = function () { hooker.counter += 1; };
    
    Hookz.call(hooker);
    Hookz.call(hookable);


    it("counter should be 2", function () {
      hooker.addHook(hookable, 'a b', callback);
      hooker.addHook(hookable, 'a b', callback, ctx);
      hooker.removeHook(null, null, ctx);
      hookable.a().b();
      Assert.strictEqual(hooker.counter, 2);
    });
  });

  context("remove all events for a specific callback", function() {

    var hooker = { 
      counter1 : 0,
      counter2 : 0
      };

    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; }
    };

    var callback1 = function () { hooker.counter1 += 1; };
    var callback2 = function () { hooker.counter2 += 1; };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("counter1 should be 2, counter2 should be 0", function () {
      hooker.addHook(hookable, 'a b', callback1);
      hooker.addHook(hookable, 'a b', callback2);
      hooker.removeHook(hookable, null, callback2);
      hookable.a().b();
      Assert.strictEqual(hooker.counter1, 2);
      Assert.strictEqual(hooker.counter2, 0);      
    });
  });

  context("removeHook does not skip consecutive hooks", function() {
    var hooker = { counter : 0 }, ctx = {};

    var hookable = {
      ___a : function () { return this; }
    };

    var callback = function () { hooker.counter += 1; };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("counter should not be incremented", function () {
      hooker.addHook(hookable, 'a', callback, ctx);
      hooker.addHook(hookable, 'a', callback, ctx);
      console.log(hookable);
      hooker.removeHook();
      hookable.a();
      Assert.strictEqual(hooker.counter, 0);
    });
  });

  it.skip("once", 2, function() {
    // Same as the previous test, but we use once rather than having to explicitly unbind
    var obj = { counterA: 0, counterB: 0 };
    Hookz.call(obj);
    var incrA = function(){ obj.counterA += 1; obj.trigger('event'); };
    var incrB = function(){ obj.counterB += 1; };
    obj.once('event', incrA);
    obj.once('event', incrB);
    obj.trigger('event');
    equal(obj.counterA, 1, 'counterA should have only been incremented once.');
    equal(obj.counterB, 1, 'counterB should have only been incremented once.');
  });

  it.skip("once variant one", function() {
    var f = function(){ ok(true); };

    var a = Hookz.call({}).once('event', f);
    var b = Hookz.call({}).on('event', f);

    a.trigger('event');

    b.trigger('event');
    b.trigger('event');
  });

  it.skip("once variant two", function() {
    var f = function(){ ok(true); };
    var obj = Hookz.call({});

    obj
      .once('event', f)
      .on('event', f)
      .trigger('event')
      .trigger('event');
  });

  it.skip("once with off", function() {
    var f = function(){ ok(true); };
    var obj = Hookz.call({});

    obj.once('event', f);
    obj.off('event', f);
    obj.trigger('event');
  });

  it.skip("once with event maps", function() {
    var obj = { counter: 0 };
    Hookz.call(obj);

    var increment = function() {
      this.counter += 1;
    };

    obj.once({
      a: increment,
      b: increment,
      c: increment
    }, obj);

    obj.trigger('a');
    equal(obj.counter, 1);

    obj.trigger('a b');
    equal(obj.counter, 2);

    obj.trigger('c');
    equal(obj.counter, 3);

    obj.trigger('a b c');
    equal(obj.counter, 3);
  });

  it.skip("once with off only by context", function() {
    var context = {};
    var obj = Hookz.call({});
    obj.once('event', function(){ ok(false); }, context);
    obj.off(null, null, context);
    obj.trigger('event');
  });

//  it.skip("Backbone object inherits Events", function() {
//    ok(Backbone.on === Backbone.Events.on);
//  });

  it.skip("once with asynchronous events", function() {
    var func = _.debounce(function() { ok(true); start(); }, 50);
    var obj = Hookz.call({}).once('async', func);

    obj.trigger('async');
    obj.trigger('async');
  });

  it.skip("once with multiple events.", function() {
    var obj = Hookz.call({});
    obj.once('x y', function() { ok(true); });
    obj.trigger('x y');
  });

  it.skip("Off during iteration with once.", function() {
    var obj = Hookz.call({});
    var f = function(){ this.off('event', f); };
    obj.on('event', f);
    obj.once('event', function(){});
    obj.on('event', function(){ ok(true); });

    obj.trigger('event');
    obj.trigger('event');
  });

//  it.skip("`once` on `all` should work as expected", function() {
//    Backbone.once('all', function() {
//      ok(true);
//      Backbone.trigger('all');
//    });
//    Backbone.trigger('all');
//  });

  it.skip("once without a callback is a noop", function() {
    Hookz.call({}).once('event').trigger('event');
  });

  it.skip("listenToOnce without a callback is a noop", function() {
    var obj = Hookz.call({});
    obj.listenToOnce(obj, 'event').trigger('event');
  });

  it.skip("event functions are chainable", function() {
    var obj = Hookz.call({});
    var obj2 = Hookz.call({});
    var fn = function() {};
    equal(obj, obj.trigger('noeventssetyet'));
    equal(obj, obj.off('noeventssetyet'));
    equal(obj, obj.stopListening('noeventssetyet'));
    equal(obj, obj.on('a', fn));
    equal(obj, obj.once('c', fn));
    equal(obj, obj.trigger('a'));
    equal(obj, obj.listenTo(obj2, 'a', fn));
    equal(obj, obj.listenToOnce(obj2, 'b', fn));
    equal(obj, obj.off('a c'));
    equal(obj, obj.stopListening(obj2, 'a'));
    equal(obj, obj.stopListening());
  });

  it.skip("#3448 - listenToOnce with space-separated events", function() {
    var one = Hookz.call({});
    var two = Hookz.call({});
    var count = 1;
    one.listenToOnce(two, 'x y', function(n) { ok(n === count++); });
    two.trigger('x', 1);
    two.trigger('x', 1);
    two.trigger('y', 2);
    two.trigger('y', 2);
  });

});