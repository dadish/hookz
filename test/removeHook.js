var Hookz = require("../");
var Assert = require('assert');
var _ = require('underscore');

describe('removeHook', function () {

  context("removes hooks with three arguments", function () {

    var hooker = { 
      counter1 : 0,
      counter2 : 0,
      counter3 : 0
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
    var callback3 = function () { hooker.counter3 += 1; };

    it("counter1 should be 1, counter2 should be 1, counter3 should be 1", function () {
      hooker.addHook(hookable, 'a', callback1);
      hooker.addHook(hookable, 'a', callback2);
      hooker.addHook(hookable, 'b', callback2);
      hookable.a().b();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 2);
    });

    it("counter1 should be 1, counter2 should be 3", function () {
      hooker.removeHook(hookable, 'a', callback1);
      hooker.removeHook(hookable, 'b', callback2);
      hookable.a();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 3);      
    });

    it("counter1 should be 1, counter2 should be 3", function () {
      hooker.removeHook(hookable, 'a', callback2);
      hookable.a();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 3);      
    });

  });

  context("removes hooks with two arguments", function () {

    context("without third, callback argument", function () {

      var hooker = { 
        counter1 : 0,
        counter2 : 0,
        counter3 : 0
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
      var callback3 = function () { hooker.counter3 += 1; };
      
      hooker.addHook(hookable, 'a', callback1);
      hooker.addHook(hookable, 'a', callback2);
      hooker.addHook(hookable, 'b', callback3);

      it("counter1 should be 1, counter2 should be 1, counter3 should be 1", function () {
        hookable.a().b();
        Assert.strictEqual(hooker.counter1, 1);
        Assert.strictEqual(hooker.counter2, 1);
        Assert.strictEqual(hooker.counter3, 1);
      });

      it("counter1 should be 1, counter2 should be 1, counter3 should be 2", function () {
        hooker.removeHook(hookable, 'a');
        hookable.a().b();
        Assert.strictEqual(hooker.counter1, 1);
        Assert.strictEqual(hooker.counter2, 1);
        Assert.strictEqual(hooker.counter3, 2);
      });

      it("counter1 should be 1, counter2 should be 1, counter3 should be 2", function () {
        hooker.removeHook(hookable, 'b');
        hookable.a().b();
        Assert.strictEqual(hooker.counter1, 1);
        Assert.strictEqual(hooker.counter2, 1);
        Assert.strictEqual(hooker.counter3, 2);
      });

    });

    context("without second, methodName argument", function () {
      var hooker = { 
        counter1 : 0,
        counter2 : 0,
        counter3 : 0
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
      var callback3 = function () { hooker.counter3 += 1; };

      hooker.addHook(hookable, 'a', callback1);
      hooker.addHook(hookable, 'b', callback1);
      hooker.addHook(hookable, 'c', callback1);
      hooker.addHook(hookable, 'b', callback2);
      hooker.addHook(hookable, 'c', callback2);
      hooker.addHook(hookable, 'c', callback3);

      it("counter1 should be 3, counter2 should be 2, counter3 should be 1", function () {
        hookable.a().b().c();
        Assert.strictEqual(hooker.counter1, 3);
        Assert.strictEqual(hooker.counter2, 2);
        Assert.strictEqual(hooker.counter3, 1);
      });

      it("counter1 should be 3, counter2 should be 4, counter3 should be 2", function () {
        hooker.removeHook(hookable, null, callback1);
        hookable.a().b().c();
        Assert.strictEqual(hooker.counter1, 3);
        Assert.strictEqual(hooker.counter2, 4);
        Assert.strictEqual(hooker.counter3, 2);
      });

      it("counter1 should be 3, counter2 should be 4, counter3 should be 3", function () {
        hooker.removeHook(hookable, null, callback2);
        hookable.a().b().c();
        Assert.strictEqual(hooker.counter1, 3);
        Assert.strictEqual(hooker.counter2, 4);
        Assert.strictEqual(hooker.counter3, 3);
      });

      it("counter1 should be 3, counter2 should be 4, counter3 should be 3", function () {
        hooker.removeHook(hookable, null, callback3);
        hookable.a().b().c();
        Assert.strictEqual(hooker.counter1, 3);
        Assert.strictEqual(hooker.counter2, 4);
        Assert.strictEqual(hooker.counter3, 3);
      });

    });

    context("without first, obj argument", function () {
      var hooker = { 
        counter1 : 0,
        counter2 : 0,
        counter3 : 0
      };
      var hookable1 = {
        ___a : function () { return this; }
      };
      
      var hookable2 = {
        ___a : function () { return this; }
      };

      var hookable3 = {
        ___a : function () { return this; }
      };

      Hookz.call(hooker);
      Hookz.call(hookable1);
      Hookz.call(hookable2);
      Hookz.call(hookable3);

      var callback1 = function () { hooker.counter1 += 1; };
      var callback2 = function () { hooker.counter2 += 1; };
      var callback3 = function () { hooker.counter3 += 1; };

      hooker.addHook(hookable1, 'a', callback1);
      hooker.addHook(hookable2, 'a', callback1);
      hooker.addHook(hookable3, 'a', callback1);
      hooker.addHook(hookable2, 'a', callback2);
      hooker.addHook(hookable3, 'a', callback2);
      hooker.addHook(hookable3, 'a', callback3);

      it("counter1 should be 3, counter2 should be 2, counter3 should be 1", function () {
        hookable1.a();
        hookable2.a();
        hookable3.a();
        Assert.strictEqual(hooker.counter1, 3);
        Assert.strictEqual(hooker.counter2, 2);
        Assert.strictEqual(hooker.counter3, 1);
      });

      it("counter1 should be 3, counter2 should be 4, counter3 should be 2", function () {
        hooker.removeHook(null, 'a', callback1);
        hookable1.a();
        hookable2.a();
        hookable3.a();
        Assert.strictEqual(hooker.counter1, 3);
        Assert.strictEqual(hooker.counter2, 4);
        Assert.strictEqual(hooker.counter3, 2);
      });

      it("counter1 should be 3, counter2 should be 4, counter3 should be 3", function () {
        hooker.removeHook(null, 'a', callback2);
        hookable1.a();
        hookable2.a();
        hookable3.a();
        Assert.strictEqual(hooker.counter1, 3);
        Assert.strictEqual(hooker.counter2, 4);
        Assert.strictEqual(hooker.counter3, 3);
      });

      it("counter1 should be 3, counter2 should be 4, counter3 should be 3", function () {
        hooker.removeHook(null, 'a', callback3);
        hookable1.a();
        hookable2.a();
        hookable3.a();
        Assert.strictEqual(hooker.counter1, 3);
        Assert.strictEqual(hooker.counter2, 4);
        Assert.strictEqual(hooker.counter3, 3);
      });      

    });
    
  });

  context("removes hooks with one argument", function () {
    
    context("the first, obj argument only", function () {
      var hooker = { 
        counter1 : 0,
        counter2 : 0,
        counter3 : 0
      };

      var hookable1 = {
        ___a : function () { return this; },
        ___b : function () { return this; }
      };

      var hookable2 = {
        ___c : function () { return this; }
      };
      
      Hookz.call(hooker);
      Hookz.call(hookable1);
      Hookz.call(hookable2);

      var callback1 = function () { hooker.counter1 += 1; };
      var callback2 = function () { hooker.counter2 += 1; };
      var callback3 = function () { hooker.counter3 += 1; };

      hooker.addHook(hookable1, 'a', callback1);
      hooker.addHook(hookable1, 'a', callback2);
      hooker.addHook(hookable1, 'a', callback3);
      hooker.addHook(hookable1, 'b', callback1);
      hooker.addHook(hookable1, 'b', callback2);
      hooker.addHook(hookable1, 'b', callback3);
      hooker.addHook(hookable2, 'c', callback1);
      hooker.addHook(hookable2, 'c', callback2);
      hooker.addHook(hookable2, 'c', callback3);

      it("counter1 should be 3, counter2 should be 3, counter3 should be 3", function () {
        hookable1.a().b();
        hookable2.c();
        Assert.strictEqual(hooker.counter1, 3);
        Assert.strictEqual(hooker.counter2, 3);
        Assert.strictEqual(hooker.counter3, 3);
      });

      it("counter1 should be 4, counter2 should be 4, counter3 should be 4", function () {
        hooker.removeHook(hookable1);
        hookable1.a().b();
        hookable2.c();
        Assert.strictEqual(hooker.counter1, 4);
        Assert.strictEqual(hooker.counter2, 4);
        Assert.strictEqual(hooker.counter3, 4);        
      });

      it("counter1 should be 4, counter2 should be 4, counter3 should be 4", function () {
        hooker.removeHook(hookable2);
        hookable1.a().b();
        hookable2.c();
        Assert.strictEqual(hooker.counter1, 4);
        Assert.strictEqual(hooker.counter2, 4);
        Assert.strictEqual(hooker.counter3, 4);        
      });

    });

    context("the second, methodName argument only", function () {
      var hooker = { 
        counter1 : 0
      };

      var hookable1 = {
        ___a : function () { return this; },
        ___b : function () { return this; }
      };

      var hookable2 = {
        ___b : function () { return this; },
        ___c : function () { return this; }
      };

      var hookable3 = {
        ___a : function () { return this; },
        ___c : function () { return this; }
      };

      
      Hookz.call(hooker);
      Hookz.call(hookable1);
      Hookz.call(hookable2);

      var callback1 = function () { hooker.counter1 += 1; };

      // We register one callback for each hookable
      // method on all hookable objects
      hooker.addHook(hookable1, 'a', callback1);
      hooker.addHook(hookable2, 'a', callback1);
      hooker.addHook(hookable3, 'a', callback1);
      hooker.addHook(hookable1, 'b', callback1);
      hooker.addHook(hookable2, 'b', callback1);
      hooker.addHook(hookable3, 'b', callback1);
      hooker.addHook(hookable1, 'c', callback1);
      hooker.addHook(hookable2, 'c', callback1);
      hooker.addHook(hookable3, 'c', callback1);

      it("counter1 should be 6", function () {
        // we call six hookable methods
        // thus the counter should be 6
        hookable1.a().b();
        hookable2.b().c();
        hookable3.a().c();
        Assert.strictEqual(hooker.counter1, 6);
      });

      it("counter1 should be 10", function () {
        // this removes hooks on 'a' methods
        hooker.removeHook(null, 'a');

        // we call six hookable methods
        // but two of them, which are 'a'
        // does not have hooks, thus extra 4
        // hooks will be called, instead of 6
        hookable1.a().b();
        hookable2.b().c();
        hookable3.a().c();
        Assert.strictEqual(hooker.counter1, 10);
      });

      it("counter1 should be 10", function () {
        // we remove the rest of the hooks with
        // space seperated multiple methodNames
        hooker.removeHook(null, 'b c');

        // no hooks left for hookable methods
        // thus no additional increments o hooker.counter1
        hookable1.a().b();
        hookable2.b().c();
        hookable3.a().c();
        Assert.strictEqual(hooker.counter1, 10);
      });

    });

  });

  context("removes multiple hooks", function() {
    var hooker = { counter: 0 };
    var hookable = { 
      ___a : function () { return this; },
      ___b : function () { return this; },
      ___c : function () { return this; }
    };

    Hookz.call(hooker);
    Hookz.call(hookable);

    hooker.addHook(hookable, 'a b c', function() { hooker.counter += 1; });

    it("counter should be incremented three times.", function () {
      hookable.a().b().c();
      Assert.strictEqual(hooker.counter, 3);
    });

    it("counter should be incremented four times.", function () {
      hooker.removeHook(hookable, 'a c');
      hookable.a().b().c();
      Assert.strictEqual(hooker.counter, 4);
    });

  });

  context("removes hooks with hook maps", function() {
    var hooker = { counter: 0 };
    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; },
      ___c : function () { return this; }
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

    it("counter should be incremented three times.", function () {
      hookable.a().b().c();
      Assert.strictEqual(hooker.counter, 3);
    });

    it("counter should be incremented four times.", function () {
      hooker.removeHook(hookable, {
        a: increment,
        c: increment
      });
      hookable.a().b().c();
      Assert.strictEqual(hooker.counter, 4);      
    });

  });

  context("removes multiple hooks with hook maps", function() {
    var hooker = { counter: 0 };
    var hookable = {
      ___a : function () { return this; },
      ___b : function () { return this; },
      ___c : function () { return this; }
    };
    Hookz.call(hooker);
    Hookz.call(hookable);

    var increment = function() {
      hooker.counter += 1;
    };

    hooker.addHook(hookable, {
      'a b c': increment
    });

    it("counter should be incremented three times.", function () {
      hookable.a().b().c();
      Assert.strictEqual(hooker.counter, 3);
    });

    it("counter should be incremented four times.", function () {
      hooker.removeHook(hookable, {
        'a c': increment
      });
      hookable.a().b().c();
      Assert.strictEqual(hooker.counter, 4);
    });
  });

  context("removes hook from youreslf", function () {
    var hookable = {
      counter: 0,
      ___a : function () { return this; },
      ___b : function () { return this; },
      ___c : function () { return this; }
    };
    Hookz.call(hookable);

    var increment = function() {
      hookable.counter += 1;
    };

    hookable.addHook(hookable, 'a', increment);
    hookable.addHook(hookable, 'b c', increment);

    it("counter should be 2", function () {
      hookable.removeHook(hookable, 'a', increment);
      hookable.a().b().c();
      Assert.strictEqual(hookable.counter, 2);
    });

    it("counter should be 2", function () {
      hookable.removeHook();
      hookable.a().b().c();
      Assert.strictEqual(hookable.counter, 2);
    })
  });

  context("cleans up references", function() {
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

  context("cleans up references from addHookOnce", function() {
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

  context("allows to remove only one callback when many hooked", function() {
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

  context("removes a hook in the midst of it firing", function() {
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

    it("the hook should have been unbound, counter1 should be 1", function () {
      hooker.addHook(hookable, 'a', callback1);
      hookable.a().a().a();
      Assert.strictEqual(hooker.counter1, 1);
    });

    it("the two hooks should have been unbound, counter1 should be 1, counter2 should be 1", function () {
      hooker.counter1 = 0;
      hooker.counter2 = 0;
      hooker.addHook(hookable, 'a', callback1);
      hooker.addHook(hookable, 'a', callback2);
      hookable.a().a().a().a();
      Assert.strictEqual(hooker.counter1, 1);
      Assert.strictEqual(hooker.counter2, 1);
    });
  });

  context("does not alter the callback list during trigger", function () {
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
    var callbackOff = function(){ hooker.removeHook(hookable, 'a all', callback); };

    it("a hook that is removed during a trigger fires once before it is removed", function () {
      hooker.addHook(hookable, 'a', callbackOff);
      hooker.addHook(hookable, 'a', callback);
      hookable.a();
      Assert.strictEqual(hooker.counter, 1);      
    });
  });

  context("does not skip consecutive hooks", function() {
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
      hooker.removeHook(null, null, ctx);
      hookable.a();
      Assert.strictEqual(hooker.counter, 0);
    });
  });

});