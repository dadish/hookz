var Events = require("../");
var Assert = require('assert');
var sinon = require('sinon');

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
  
  it("returns it's object");

  it("hookMethod is invoked when it's hookableMethod is called");

  it("hookMethod is invoked everytime it's hookableMethod is called");

  it("by default hookMethod is called on hookObject");

  it("if provided when hooked, a hookMethod is called on desired object");

  it("hookMethod is called with only one argument, that is a HookEvent object");

  it("HookEvent has an `arguments` property which is an Array");

  it("HookEvent's `arguments` property contains all arguments passed into hookableMethod when invoked");

  it("All items in HookEvent's `arguments` property could be modified for the next hookMethod in chain");

  it("HookEvent has an `object` property that references the object to which the hookMethod was attached to");

  it("HookEvent has a `return` property that is a value returned by hookableMethod");

  it("The `return` property of the HookEvent object could be modified for the next hookMethod in chain");

  it("HookEvent has a `replace` property, which if set to true the hookMethod will be invoked instead of hookableMethod");

  it("Adds a method into an object if the hookableMethod does not exist yet");

  it("Methods added via addHook are also hookable");

  it("cannot hook into methods that are not properly prefixed");

});