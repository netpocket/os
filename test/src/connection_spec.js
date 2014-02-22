require('../spec_helper.js');
var Device = require('../../src/models/device.js');

describe("Connection", function() {
  var socket = null,
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

  describe("relay errors", function() {
    beforeEach(function() {
      call = socket.on.getCall(0);
      sinon.stub(console, 'log');
    });
    it("listens for relay error", function() {
      expect(call.args[0]).to.eq('relay error');
    });
    it("logs the error", function() {
      call.args[1]({some:'error'});
      expect(console.log).to.have.been.calledWith('relay error', {some:'error'});
    });
    afterEach(function() {
      console.log.restore();
    });
  });

  describe("identification", function() {
    beforeEach(function() {
      call = socket.on.getCall(1);
    });
    it("listens for identification request", function() {
      expect(call.args[0]).to.eq('please identify');
    });
    it("identifies as a netpocketos device using a token and seeds the device", function() {
      call.args[1]();
      expect(socket).to.write('i am a netpocketos device', 'token', device);
    });
  });
});
