if (typeof window === "undefined") {
  var chai = require('chai'),
      sinon = require('sinon'),
      sinonChai = require('sinon-chai'),
      _ = require('underscore')._;

  chai.use(sinonChai);
}


/* Assert that it just wrote */
chai.Assertion.addMethod('write', function(){
  var obj = this._obj;
  var args = Array.prototype.slice.call(arguments, 0);
  this.assert(
    _.isEqual(obj.write.getCall(obj.write.callCount-1).args[0].args, args),
    "expected to write #{exp}, but wrote #{act}",
    "expected not to write #{act}",
    args,
    obj.write.getCall(0).args[0].args,
    true
  );
});

/* Assert that it just wrote but when asserting about objects
 * just make sure the content you asserted to exist exists --- 
 * in other words don't fail if there's data there too that you
 * didnt specifically assert about */
chai.Assertion.addMethod('writeAtLeast', function(){
  var obj = this._obj;
  var args = Array.prototype.slice.call(arguments, 0);
  var atLeastEqual = function(act, exp) {
    for (var i = 0, l = act.length; i < l; i ++) {
      var act_v = act[i];
      var exp_v = exp[i];
      if (_.isObject(exp_v)) {
        if (_.isArray(exp_v)) {
          /* the meat of this function is operating on objects
           * it is designed to operate on an array already, so recurse */
          if ( ! atLeastEqual(act_v, exp_v)) { return false; }
        } else {
          // check each property has at least what i am asserting about
          for (var key in exp_v) {
            if ( ! _.isEqual(act_v[key], exp_v[key])) { return false; }
          }
          _.matches(act_v, exp_v);
        }
      } else if (act_v !== exp_v) {
        return false;
      }
    }
    return true;
  };
  this.assert(
    atLeastEqual(obj.write.getCall(obj.write.callCount-1).args[0].args, args),
    "expected to write at least #{exp}, but wrote only #{act}",
    "expected not to write at least #{act}",
    args,
    obj.write.getCall(0).args[0].args,
    true
  );
});

chai.Assertion.addProperty('writeOnce', function(){
  var act = this._obj.write.callCount;
  var exp = 1;
  this.assert(
    act === exp,
    "expected to write #{exp} times but wrote #{act} times",
    "expected not to write #{exp} time",
    exp,
    act
  );
});

/* Assert that it was written at some point in the spy's lifetime */
chai.Assertion.addMethod('written', function(){
  var obj = this._obj;
  var args = Array.prototype.slice.call(arguments, 0);
  var everWrote = function() {
    for (var i = 0, l = obj.write.callCount; i < l; i ++) {
      var test = obj.write.getCall(i).args[0].args;
      if (_.isEqual(test, args)) {
        return true;
      } 
    }
    return false;
    //_.isEqual(obj.write.getCall(obj.write.callCount-1).args[0].args, args)
  };
  this.assert(
    everWrote(),
    "expected to have written #{exp} but it never did",
    "expected not to have ever written #{act}, but it did",
    args[0],
    obj.write.getCall(0).args[0].args,
    true
  );
});

/* Assert that an event emitter was told to listen with 'on' */
chai.Assertion.addMethod('listenOn', function(){
  var obj = this._obj;
  var args = Array.prototype.slice.call(arguments, 0);
  var test = null;
  var wasToldToListenOn = function() {
    for (var i = 0, l = obj.on.callCount; i < l; i ++) {
      var test = obj.on.getCall(i).args[0];
      if (_.isEqual(test, args[0])) {
        return true;
      } 
    }
    return false;
  };
  this.assert(
    wasToldToListenOn(args[0]),
    "expected to be told to listen for #{exp} but wasn't",
    "expected not to be told to listen for #{exp}, it was",
    args[0],
    test,
    true
  );
});


/* Assert that an event emitter was told to listen with 'once' */
chai.Assertion.addMethod('listenOnce', function(){
  var obj = this._obj;
  var args = Array.prototype.slice.call(arguments, 0);
  var test = null;
  var wasToldToListenOnce = function() {
    for (var i = 0, l = obj.once.callCount; i < l; i ++) {
      var test = obj.once.getCall(i).args[0];
      if (_.isEqual(test, args[0])) {
        return true;
      } 
    }
    return false;
  };
  this.assert(
    wasToldToListenOnce(args[0]),
    "expected to be told to listen for #{exp} but wasn't",
    "expected not to be told to listen for #{exp}, it was",
    args[0],
    test,
    true
  );
});

/* Stubs */

var sparkStub = function() {
  var obj = {
    on: sinon.stub(),
    once: sinon.stub(),
    write: sinon.stub(),
    reserved: sinon.stub(),
    emit: sinon.stub()
  };

  /* Utility methods */

  /* Get the callback for a listener 
   * defined using EventEmitter's "on" method */
  obj.onCallback = function(label) {
    for (var i = 0, l = obj.on.callCount; i < l; i ++) {
      var args = obj.on.getCall(i).args;
      if (args[0] === label) {
        return args[1];
      }
    }
    throw new Error("spark was not listening on "+label);
  };

  /* Get the callback for a listener 
   * defined using EventEmitter's "once" method */
  obj.onceCallback = function(label) {
    for (var i = 0, l = obj.once.callCount; i < l; i ++) {
      var args = obj.once.getCall(i).args;
      if (args[0] === label) {
        return args[1];
      }
    }
    throw new Error("spark was not listening once on "+label);
  };

  return obj;
};

if (typeof window === "undefined") {
  module.exports = {
    chai: chai,
    sinon: sinon,
    spark: sparkStub
  };
}

