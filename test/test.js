var Events = require("../");
var Assert = require('assert');
var _ = require('underscore');
var todo = require('./todo.js');
var cat = require('./cat.js');

describe('listenTo', function () {
  Events.call(todo, '___');
  Events.call(cat, '___');
  it('should attach an event with listenTo method', function (done) {
    todo.listenTo(cat, 'walk', function (dog) {
      Assert.strictEqual(dog, 'dog');
      done();
    });
    cat.walk('dog');
  });
});