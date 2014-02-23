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

  describe("browser<->device communication by relay", function() {
    beforeEach(function() {
      call = socket.on.getCall(2);
    });
    /*
     * relay sends us:
     * 'relay', 'browser:Ba', payload
     * we must look in the payload, honor it
     * and send back to the recipient
     */
    it("listens for relay messages", function() {
      expect(call.args[0]).to.eq('relay');
    });

    it("processes payload and returns one back with the recipient identifier intact", function() {
      call.args[1]('recipient:identifier', {
        my: "payload",
        real: "special"
      });
      expect(socket).to.write('recipient:identifier', {
        error: 422,
        reason: "unprocessable entity",
        detail: "your payload was semantically erroneous"
      });
    });
  });
});
