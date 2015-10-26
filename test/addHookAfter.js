var Hookz = require("../");
var Assert = require('assert');
var _ = require('underscore');

var testMethod = 'addHookAfter';

describe(testMethod, function () {

  context("hooking and triggering", function() {
    var hookable = { 
      ___hookableMethod : function () {}
    };
    
    var hooker = {counter: 0};

    Hookz.call(hookable);
    Hookz.call(hooker);
    
    hooker[testMethod](hookable, 'hookableMethod', function() { 
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
      hooker[testMethod](hookable, 'a', function () { hooker.counter += 1; });
      hooker[testMethod](hookable, 'a', function () { hooker.counter += 1; });
      
      hookable.a();
      Assert.strictEqual(hooker.counter, 2);
    });

    it("counter should be incremented five times.", function () {
      hooker[testMethod](hookable, 'a', function () { hooker.counter += 1; });
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

    hooker[testMethod](hookable, 'a b c', function() { hooker.counter += 1; });

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

  });

  context("hooking and triggering with hook maps", function() {
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

    hooker[testMethod](hookable, {
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
  });

  context("hooking and triggering multiple methods with hook maps", function() {
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

    hooker[testMethod](hookable, {
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
      hooker[testMethod](hookable, 'a', function () {
        Assert.strictEqual(this, hooker);
      });
      hookable.a();
      hooker.removeHook();
    });

    it("defaults to `hooker` when hooked into multiple methods.", function () {
      hooker[testMethod](hookable, 'a b', function () {
        Assert.strictEqual(this, hooker);
      });
      hookable.a();
      hookable.b();
      hooker.removeHook();
    });

    it("can be set as a fourth argument", function () {
      hooker[testMethod](hookable, 'a b', function () {
        Assert.strictEqual(this, ctx);
      }, ctx);
      hookable.a();
      hookable.b();
      hooker.removeHook();
    });

    it("can be set as a third argument when hooked as a hooks map", function () {
      hooker[testMethod](hookable, {
        a : function () {
          Assert.strictEqual(this, ctx);
        }
      }, ctx);
      hookable.a();
      hooker.removeHook();
    });

    it("is set for all hookMethods when set as a third argument when hooked as a hooks map", function () {
      hooker[testMethod](hookable, {
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
      hooker[testMethod](hookable, {
        a : function () {
          Assert.strictEqual(this, ctx);
        }
      }, hooker, ctx);
      hookable.a();
      hooker.removeHook();
    });

  });

  context([testMethod] + " to yourself", function(){
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
      hookable[testMethod](hookable, 'a', callback1);
      hookable[testMethod](hookable, 'b', callback2);
      hookable.a().a().b();
      Assert.strictEqual(hookable.counter1, 2);
      Assert.strictEqual(hookable.counter2, 1);      
    });
  });

  context("empty callback doesn't throw an error", function(){
    var hooker = {};

    var hookable = {
      ___a : function () {return this;}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("there is no error", function () {
      hooker[testMethod](hookable, 'a', null);
      hookable.a();
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
      hooker[testMethod](hookable, 'a', function () { this.assertTrue() }, testContext);
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
      hooker[testMethod](hookable, 'a', callback1);
      hooker[testMethod](hookable, 'a', callback2);
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
    var callbackOn = function(){ hooker[testMethod](hookable, 'a all', callback); };

    it("a hook that is added during a trigger does not fire until the next trigger", function () {
      hooker[testMethod](hookable, 'a', callbackOn);
      hooker[testMethod](hookable, 'a', callbackOn);
      hooker[testMethod](hookable, 'a', callbackOn);
      hooker[testMethod](hookable, 'a', callbackOn);
      // ...
      hookable.a();
      Assert.strictEqual(hooker.counter, 0);
      hookable.a();
      Assert.strictEqual(hooker.counter, 8);
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
      hooker[testMethod](hookable, 'a', callback);
    };

    it("counter should be 3", function () {
      hooker[testMethod](hookable, 'a', callback);
      hookable.a().a();
      Assert.strictEqual(hooker.counter, 3);
    });
  });

  context("if no callback is provided, `[testMethod]` is a noop", function() {
    var hooker = {};

    var hookable = {
      ___a : function () { return this; }
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("nothing should happen", function () {
      hooker[testMethod](hookable, 'a');
      hookable.a().a().a();
    });
  });

  context("if callback is truthy but not a function, then `[testMethod]`", function() {
    var hooker = {};

    var hookable = {
      ___a : function () { return this; }
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("should throw an error", function () {
      hooker[testMethod](hookable, 'a', 'noop');  
      Assert.throws(function () {
        hookable.a()
      }, Error);
    });
  });

  context("trigger all for each hook", function() {
    
    var hooker = { counter : 0 };

    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; },
      ___c : function () { return this; },
      ___d : function () { return this; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function () { hooker.counter += 1; };

    it("counter should be 4", function () {
      hooker[testMethod](hookable, 'all', callback);
      hookable.a().b().c().d().a();
      Assert.strictEqual(hooker.counter, 5);
    });
  });
});