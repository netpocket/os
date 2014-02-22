require('../../spec_helper.js');
var Device = require('../../../src/models/device.js');
var Backbone = require('backbone');

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
      var os = require('os');

      it("can get uptime", function() {
        sinon.stub(os, 'uptime').returns('12345');
        features.os['get uptime'].fn();
        expect(socket).to.write('feature:response:os:get uptime', null, "12345");
        os.uptime.restore();
      });
    });

    describe("packages", function() {
      it("can list apt packages");
      it("can install apt packages");
    });
  });

  describe("configuration files", function() {
    it("can create additional features");
  });

  describe("initialize", function() {
    it("loads configuration files");
  });
});
