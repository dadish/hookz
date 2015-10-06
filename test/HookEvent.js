var Hookz = require("../");
var Assert = require('assert');
var sinon = require('sinon');
var _ = require('underscore');

describe('hookEvent', function () {

  it.skip("trigger all for each event", function() {
    var a, b, obj = { counter: 0 };
    Hookz.call(obj);
    obj.on('all', function(event) {
      obj.counter++;
      if (event == 'a') a = true;
      if (event == 'b') b = true;
    })
    .trigger('a b');
    ok(a);
    ok(b);
    equal(obj.counter, 2);
  });

});