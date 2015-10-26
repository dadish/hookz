var Hookz = require("../");
var Assert = require('assert');
var _ = require('underscore');

describe('addHookOnce', function () {

  context("basic usage", function() {
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

  context("variant one", function() {

    var hooker = { counter : 0 }, ctx = {};

    var hookable = {
      ___a : function () { return this; }
    };

    var callback = function () { hooker.counter += 1;};

    Hookz.call(hooker);
    Hookz.call(hookable);

    // var f = function(){ ok(true); };
    // var a = Hookz.call({}).once('event', f);
    // var b = Hookz.call({}).on('event', f);
    hooker.addHookOnce(hookable, 'a', callback);
    hooker.addHook(hookable, 'a', callback);
    hookable.a().a().a();

    it("counter should be 4", function () {
      Assert.strictEqual(hooker.counter, 4);  
    });
  });

  context("variant two", function() {
    var hooker = { counter : 0 }, ctx = {};

    var hookable = {
      ___a : function () { return this; }
    };

    var callback = function () { hooker.counter += 1;};

    Hookz.call(hooker);
    Hookz.call(hookable);

    it("counter should be 3", function () {
      hooker
        .addHookOnce(hookable, 'a', callback)
        .addHook(hookable, 'a', callback);
      hookable.a().a();
      Assert.strictEqual(hooker.counter, 3);
    });
  });

  context("with removeHook", function() {
    var hooker = { counter : 0 }, ctx = {};

    var hookable = {
      ___a : function () { return this; }
    };

    var callback = function () { hooker.counter += 1;};

    Hookz.call(hooker);
    Hookz.call(hookable);

    it("counter should be 0", function () {
      hooker.addHookOnce(hookable, 'a', callback);
      hooker.removeHook(hookable, 'a', callback);
      hookable.a();
      Assert.strictEqual(hooker.counter, 0);
    });
  });
  
  context("cleans up references after the hookMethod has fired", function() {
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

  context("empty callback doesn't throw an error", function(){
    var hooker = {};

    var hookable = {
      ___a : function () {return this;}
    };
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("there is no error", function () {
      hooker.addHookOnce(hookable, 'a', null);
      hookable.a();
    });
  });

  context("with hook maps", function() {
    var hooker = { counter : 0 };

    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; },
      ___c : function () { return this; }
    };

    var callback = function () { hooker.counter += 1;};
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    hooker.addHookOnce(hookable, {
      a : callback,
      b : callback,
      c : callback
    });

    it("counter should be 1", function () {
      hookable.a();
      Assert.strictEqual(hooker.counter, 1);
    });

    it("counter should be 2", function () {
      hookable.a().b();
      Assert.strictEqual(hooker.counter, 2);
    });

    it("counter should be 3", function () {
      hookable.c();
      Assert.strictEqual(hooker.counter, 3);
    });

    it("counter should be 3", function () {
      hookable.a().b().c();
      Assert.strictEqual(hooker.counter, 3);
    });
  });

  context("with removeHook only by context", function() {
    var hooker = { counter : 0 };
    var ctx = {};

    var hookable = {
      ___a : function () { return this; }
    };

    var callback = function () { hooker.counter += 1;};
    
    Hookz.call(hooker);
    Hookz.call(hookable);

    it("counter should be 0", function () {
      hooker.addHookOnce(hookable, 'a', callback, ctx);
      hooker.removeHook(null, null, ctx);
      hookable.a().a().a();
      Assert.strictEqual(hooker.counter, 0);
    });
  });

  context("with asynchronous hooks", function() {
    var hooker = { counter : 0 };

    var hookable = {
      ___a : function () { return this; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    it("counter should be 1", function (done) {
      var callback = function () {
        setTimeout(function () {
          hooker.counter += 1;
          if (hooker.counter > 1) throw new Error('This should not be thrown');
        }, 20);
      };
      hooker.addHookOnce(hookable, 'a', callback);
      hookable.a().a();
      setTimeout(done, 50);
    });    
  });

  context("with multiple hooks.", function() {
    var hooker = { counter : 0 };

    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function () { hooker.counter += 1;};

    it('counter should be 2', function () {
      hooker.addHookOnce(hookable, 'a b', callback);
      hookable.a().b().a().b();
      Assert.strictEqual(hooker.counter, 2);
    });
  });

  context("removeHook during iteration with addHookOnce.", function() {
    var hooker = { counter : 0 };

    var hookable = {
      ___a : function () { return this; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function () { hooker.counter += 1; this.removeHook(hookable, 'a', callback); };

    it("counter should be 2", function () {
      hooker.addHook(hookable, 'a', callback);
      hooker.addHookOnce(hookable, 'a', callback);
      hookable.a().a().a().a();      
      Assert.strictEqual(hooker.counter, 2);
    });
  });

  context("addHookOnce without a callback is a noop", function() {
    var hooker = {};

    var hookable = {
      ___a : function () { return this; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    function callback () {
      throw new Error("this should not be thrown");
    }

    it("there should be nothing", function () {
      hooker.addHookOnce(hookable,'a');
      hookable.a();
    });
  });

  context("addHookOnce with space-separated hooks", function() {
    var hooker = { counter : 0 };

    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    var callback = function () { hooker.counter += 1; };

    hooker.addHookOnce(hookable, 'a b', callback);
    
    it("counter should be 1", function  () {
      hookable.a().a().a().a();;
      Assert.strictEqual(hooker.counter, 1);
    });

    it("counter should be 2", function () {
      hookable.b().b().a().a().b().b();
      Assert.strictEqual(hooker.counter, 2);
    });
  });

});