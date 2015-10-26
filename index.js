var HookEvent = require('./HookEvent');
var _ = require('underscore');

// Create a local reference to a common array method we'll want to use later.
var slice = Array.prototype.slice;

function Events (hookPrefix) {
  var methodName;

  // Default hookPrefix
  this._hookPrefix = hookPrefix || '___';
  
  for (key in this) {
    if (key.indexOf(this._hookPrefix) === 0) {
      methodName = key.slice(this._hookPrefix.length);
      this[methodName] = hookzApi(this, methodName, key);
    }
  }
  _.extend(this, Events);

  return this;
}

function hookzApi (obj, methodName, nativeMethodName) {
  return function () {
    var args, returnVaue, hookEv, a1, a2, a3;

    hookEv = new HookEvent();
    hookEv.args = slice.call(arguments, 0);
    hookEv.obj = obj;
    hookEv.replaces = false;
    hookEv.methodName = methodName;
    if (obj._events) triggerApi(obj._events, 'before:' + methodName, void 0, hookEv, 'before:');

    // Optimize the method call
    args = hookEv.args;
    a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: returnValue = obj[nativeMethodName](); break;
      case 1: returnValue = obj[nativeMethodName](a1); break;
      case 2: returnValue = obj[nativeMethodName](a1, a2); break;
      case 3: returnValue = obj[nativeMethodName](a1, a2, a3); break;
      default: returnValue = obj[nativeMethodName].apply(obj, args);
    }

    // Get the returned value from the hookable method
    hookEv.returnValue = returnValue;

    if (obj._events) {
      // Trigger addHook hooks
      triggerApi(obj._events, methodName, void 0, hookEv, '');

      // Trigger addHookAfter hooks
      triggerApi(obj._events, 'after:' + methodName, void 0, hookEv, 'after:');
    }
    return hookEv.returnValue;
  }
}

// Regular expression used to split event strings.
var eventSplitter = /\s+/;

// Iterates over the standard `event, callback` (as well as the fancy multiple
// space-separated events `"change blur", callback` and jQuery-style event
// maps `{event: callback}`).
var eventsApi = function(iteratee, events, name, callback, opts) {
  var i = 0, names;
  if (name && typeof name === 'object') {
    // Handle event maps.
    if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
    for (names = _.keys(name); i < names.length ; i++) {
      events = eventsApi(iteratee, events, names[i], name[names[i]], opts);
    }
  } else if (name && eventSplitter.test(name)) {
    // Handle space separated event names by delegating them individually.
    for (names = name.split(eventSplitter); i < names.length; i++) {
      events = iteratee(events, names[i], callback, opts);
    }
  } else {
    // Finally, standard events.
    events = iteratee(events, name, callback, opts);
  }
  return events;
};

// Guard the `listening` argument from the public API.
var internalOn = function(obj, name, callback, context, listening) {
  obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
      context: context,
      ctx: obj,
      listening: listening
  });

  if (listening) {
    var listeners = obj._listeners || (obj._listeners = {});
    listeners[listening.id] = listening;
  }

  return obj;
};

// This is a Backbone listenTo method tweaked
Events.addHook =  function(obj, name, callback, context) {
  if (!obj) return this;

  var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
  var listeningTo = this._listeningTo || (this._listeningTo = {});
  var listening = listeningTo[id];

  // This object is not listening to any other events on `obj` yet.
  // Setup the necessary references to track the listening callbacks.
  if (!listening) {
    var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
    listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
  }

  // context defaults to this 
  // or callback if provided as third argument
  if (name && typeof name === 'object') {
    if (callback !== void 0 && context === void 0) context = callback;
  }
  context = context || this;
  
  // Bind callbacks on obj, and keep track of them on listening.
  internalOn(obj, name, callback, context, listening);
  return this;
};

// The reducing API that adds a callback to the `events` object.
var onApi = function(events, name, callback, options) {
  if (callback) {

    var obj = options.ctx, prefixedName = obj._hookPrefix + name;

    // If the object does not have a hookableMethod
    // create one
    if (typeof obj[prefixedName] !== 'function') {
      if (obj[name] !== void 0) return events;
      obj[prefixedName] = function () { return this; };
      obj[name] = hookzApi(obj, name, prefixedName);
    }

    var handlers = events[name] || (events[name] = []);
    var context = options.context, ctx = options.ctx, listening = options.listening;
    if (listening) listening.count++;

    handlers.push({ callback: callback, context: context, ctx: context || ctx, listening: listening });
  }
  return events;
};

Events.addHookBefore = function(obj, name, callback, context) {
  var i = 0, names;
  if (name && typeof name === 'object') {
    // Handle event maps.
    for (names = _.keys(name); i < names.length ; i++) {
      this.addHook(obj, 'before:' + names[i], name[names[i]], context || callback);
    }
  } else if (name && eventSplitter.test(name)) {
    // Handle space separated event names by delegating them individually.
    for (names = name.split(eventSplitter); i < names.length; i++) {
      this.addHook(obj, 'before:' + names[i], callback, context);
    }
  } else {
    // Finally, standard events.
    this.addHook(obj, name, callback, context);
  }
  return this;
};

Events.addHookAfter = function(obj, name, callback, context) {
  var i = 0, names;
  if (name && typeof name === 'object') {
    // Handle event maps.
    for (names = _.keys(name); i < names.length ; i++) {
      this.addHook(obj, 'after:' + names[i], name[names[i]], context || callback);
    }
  } else if (name && eventSplitter.test(name)) {
    // Handle space separated event names by delegating them individually.
    for (names = name.split(eventSplitter); i < names.length; i++) {
      this.addHook(obj, 'after:' + names[i], callback, context);
    }
  } else {
    // Finally, standard events.
    this.addHook(obj, name, callback, context);
  }
  return this;
};

// Remove one or many callbacks. If `context` is null, removes all
// callbacks with that function. If `callback` is null, removes all
// callbacks for the event. If `name` is null, removes all bound
// callbacks for all events.
var off =  function(name, callback, context) {
  if (!this._events) return this;
  this._events = eventsApi(offApi, this._events, name, callback, {
      context: context,
      listeners: this._listeners
  });
  return this;
};

// Tell this object to stop listening to either specific events ... or
// to every object it's currently listening to.
Events.removeHook =  function(obj, name, callback, context) {
  var listeningTo = this._listeningTo;
  if (!listeningTo) return this;

  var ids = obj ? [obj._listenId] : _.keys(listeningTo);

  // context defaults to this 
  // or callback if provided as third argument
  if (typeof callback === 'object' && context === void 0) context = callback;

  // callback was not provided if it is not a function
  if (typeof callback !== 'function') callback = void 0;

  for (var i = 0; i < ids.length; i++) {
    var listening = listeningTo[ids[i]];

    // If listening doesn't exist, this object is not currently
    // listening to obj. Break out early.
    if (!listening) break;

    off.call(listening.obj, name, callback, context);
  }
  if (_.isEmpty(listeningTo)) this._listeningTo = void 0;

  return this;
};

// The reducing API that removes a callback from the `events` object.
var offApi = function(events, name, callback, options) {
  if (!events) return;

  var i = 0, listening;
  var context = options.context, listeners = options.listeners;

  // Delete all events listeners and "drop" events.
  if (!name && !callback && !context) {
    var ids = _.keys(listeners);
    for (; i < ids.length; i++) {
      listening = listeners[ids[i]];
      delete listeners[listening.id];
      delete listening.listeningTo[listening.objId];
    }
    return;
  }

  var names = name ? [name] : _.keys(events);
  for (; i < names.length; i++) {
    name = names[i];
    var handlers = events[name];

    // Bail out if there are no events stored.
    if (!handlers) break;

    // Replace events if there are any remaining.  Otherwise, clean up.
    var remaining = [];
    for (var j = 0; j < handlers.length; j++) {
      var handler = handlers[j];
      if (
        callback && callback !== handler.callback &&
          callback !== handler.callback._callback ||
            context && context !== handler.context
      ) {
        remaining.push(handler);
      } else {
        listening = handler.listening;
        if (listening && --listening.count === 0) {
          delete listeners[listening.id];
          delete listening.listeningTo[listening.objId];
        }
      }
    }

    // Update tail event if the list has any events.  Otherwise, clean up.
    if (remaining.length) {
      events[name] = remaining;
    } else {
      delete events[name];
    }
  }
  if (_.size(events)) return events;
};

// Inversion-of-control versions of `once`.
Events.addHookOnce =  function(obj, name, callback, context) {

  // context defaults to this 
  // or callback if provided as third argument
  if (name && typeof name === 'object') {
    if (callback !== void 0 && context === void 0) context = callback;
  }
  context = context || this;

  // Map the event into a `{event: once}` object.
  var events = eventsApi(onceMap, {}, name, callback, _.bind(this.removeHook, this, obj));
  return this.addHook(obj, events, context);
};

// Reduces the event callbacks into a map of `{event: onceWrapper}`.
// `offer` unbinds the `onceWrapper` after it has been called.
var onceMap = function(map, name, callback, offer) {
  if (callback) {
    var once = map[name] = _.once(function() {
      offer(name, once);
      callback.apply(this, arguments);
    });
    once._callback = callback;
  }
  return map;
};

// Handles triggering the appropriate event callbacks.
var triggerApi = function(objEvents, name, cb, hookEv, when) {
  if (objEvents) {
    var events = objEvents[name];
    var allEvents = objEvents[when + 'all'];
    if (events && allEvents) allEvents = allEvents.slice();
    if (events) triggerEvents(events, hookEv);
    if (allEvents) triggerEvents(allEvents, [name].concat(hookEv));
  }
  return objEvents;
};

// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy (most internal
// Backbone events have 3 arguments).
var triggerEvents = function(events, hookEv) {
  var ev, i = -1, l = events.length;
  while (++i < l) (ev = events[i]).callback.call(ev.ctx, hookEv);
};

module.exports = Events;