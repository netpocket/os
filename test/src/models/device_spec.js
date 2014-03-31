require('../../spec_helper.js');
var Device = require('../../../src/models/device.js');
var Backbone = require('backbone');
var fs = require('fs');

describe("Device", function() {
  var device = null,
      features = null;
      socket = null,
      conn = null,
      device = null,
      call = null;

  beforeEach(function() {
    socket = {
      on: sinon.stub(),
      write: sinon.stub()
    };
    device = new Device();
    device.connect(socket, {token: 'token'});
    conn = device.connection;
  });

  it("is a backbone model", function() {
    expect(device).to.be.an.instanceof(Backbone.Model);
  });

  describe("default features", function() {
    beforeEach(function() {
      features = device.get('features');
    });

    describe("os", function() {
      var os = require('os'),
          spy = sinon.spy();

      beforeEach(function() {
        sinon.stub(os, 'uptime').returns('12345');
      });

      afterEach(function() {
        os.uptime.restore();
      });

      it("can get uptime", function() {
        features.os['get uptime'].fn(spy);
        expect(spy).to.have.been.calledWith(null, '12345');
      });
    });
  });

  describe("loadAttributes()", function() {
    it("loads attributes from disk synchronously", function(done) {
      device.configFile = __dirname+'/../../fixtures/device.json';
      fs.writeFile(device.configFile, JSON.stringify({name:'The Name'}), function() {
        device.set('name', 'foo');
        device.loadAttributes();
        expect(device.get('name')).to.eq('The Name');
        done();
      });
    });
  });

  describe("persistAttributes()", function() {
    it("writes attributes to disk asynchronously", function(done) {
      device.configFile = __dirname+'/../../fixtures/device_tmp.json';
      fs.writeFile(device.configFile, JSON.stringify({name:''}), function() {
        device.set('name', 'persist test');
        device.persistAttributes(function() {
          expect(require(device.configFile).name).to.eq('persist test');
          done();
        });
      });
    });
    afterEach(function() {
      fs.unlink(device.configFile);
    });
  });
});
