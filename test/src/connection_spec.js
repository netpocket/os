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

    it("listens for relay messages", function() {
      expect(call.args[0]).to.eq('relay');
    });

    describe("invalid request", function() {
      describe("cmd is missing", function() {
        it("sends back an error message", function() {
          call.args[1]('recipient:identifier', {
            my: "payload",
            real: "special"
          });
          expect(socket).to.write('recipient:identifier', {
            error: 400,
            reason: "Bad Request",
            detail: "It's not clear what you want me to do. Giving up."
          });
        });
      });

      describe("cmd is does not resolve to an object", function() {
        it("sends back an error message", function() {
          call.args[1]('recipient:identifier', {
            cmd: "wont resolve"
          });
          expect(socket).to.write('recipient:identifier', {
            error: 400,
            reason: "Bad Request",
            detail: "It's not clear what you want me to do. Giving up."
          });
        });
      });

      describe("cmd is valid but", function() {
        describe("args are missing", function() {
          it("sends back an error message", function() {
            call.args[1]('recipient:identifier', {
              cmd: 'feature request'
            });
            expect(socket).to.write('recipient:identifier', {
              error: 400,
              reason: "Bad Request",
              detail: "It's not clear what you want me to do. Giving up."
            });
          });
        });
        
        describe("args is not an array", function() {
          it("sends back an error message", function() {
            call.args[1]('recipient:identifier', {
              cmd: 'feature request',
              args: 'not an array'
            });
            expect(socket).to.write('recipient:identifier', {
              error: 400,
              reason: "Bad Request",
              detail: "It's not clear what you want me to do. Giving up."
            });
          });
        });
        
        describe("args do not resolve to a function", function() {
          it("sends back an error message", function() {
            call.args[1]('recipient:identifier', {
              cmd: 'feature request',
              args: ['does', 'not', 'resolve']
            });
            expect(socket).to.write('recipient:identifier', {
              error: 400,
              reason: "Bad Request",
              detail: "It's not clear what you want me to do. Giving up."
            });
          });
        });
      });
    });

    describe("requesting a default feature (os:get uptime)", function() {
      var os = require('os');

      beforeEach(function() {
        sinon.stub(os, 'uptime').returns('12345');
      });

      afterEach(function() {
        os.uptime.restore();
      });

      it("processes the payload and responds", function() {
        call.args[1]('recipient:identifier', {
          listen: "once",
          cmd: "feature request",
          args: [ "os", "get uptime" ]
        });
        expect(socket).to.write('recipient:identifier', {
          cmd: "feature response",
          args: [ "os", "get uptime" ],
          err: null,
          res: '12345'
        });
      });
    });
  });
});
