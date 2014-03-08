require('../spec_helper.js');
var Worker = require('../../src/worker.js'),
    Primus = require('primus'),
    domain = require('domain'),
    http = require('http');


describe("Worker", function() {
  var config = null,
      d = null,
      worker = null;
  
  beforeEach(function() {
    config = {
      relayServer: "http://example.com:12345",
      token: "my token"
    };
  });

  describe("connect", function() {
    beforeEach(function() {
      d = {
        on: sinon.stub(),
        run: sinon.stub()
      };
      sinon.stub(domain, 'create').returns(d);
      worker = new Worker(config);
      worker.connect();
    });

    it("runs inside a domain", function() {
      expect(d.run).to.have.been.calledOnce;
    });

    describe("socket builder", function() {
      var res = null,
          socket = null,
          conn = null,
          spec = {parser:'json'};

      beforeEach(function() {
        socket = {
          on: sinon.stub(),
          write: sinon.stub(),
          emit: {apply: sinon.stub()},
          reserved: sinon.stub()
        };
        sinon.stub(Primus, 'createSocket').returns(function() {
          return socket;
        });
        res = {
          on: sinon.stub().yields(JSON.stringify(spec))
        };
        sinon.stub(http, 'get').yields(res);
        d.run.getCall(0).args[0]();
      });

      it("requests the primus spec", function() {
        var specURL = config.relayServer+'/primus/spec';
        expect(http.get.getCall(0).args[0]).to.eq(specURL);
      });

      it("listens to the socket's 'data' event", function() {
        expect(socket.on.getCall(1).args[0]).to.eq('data');
      });

      describe("socket data event", function() {
        var fn = null;
        var data = null;
        beforeEach(function() {
          fn = socket.on.getCall(1).args[1];
          data = {args: ['event:name', {'my':'data'}]};
          fn(data);
        });
        it("checks if we will clash with a Primus reserved word", function() {
          expect(socket.reserved).to.have.been.calledWith('event:name');
        });
        it("applies the data to the socket's emit method", function() {
          expect(socket.emit.apply.getCall(0).args[0]).to.eq(socket);
          expect(socket.emit.apply.getCall(0).args[1]).to.eq(data.args);
        });
        
      });

      afterEach(function() {
        Primus.createSocket.restore();
        http.get.restore();
      });
    });

    afterEach(function() {
      domain.create.restore();
    });
  });
});
