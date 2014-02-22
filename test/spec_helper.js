var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

_ = require('underscore');

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

global.expect = chai.expect;
global.sinon = require('sinon');

