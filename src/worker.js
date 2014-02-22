var Connection = require('./connection.js');

var Worker = (function(config) {
  "use strict";

  var Primus = require('primus'),
      http = require('http'),
      domain = require('domain'),
      d = domain.create();

  d.on('error', workerError);

  this.connect = function() {
    d.run(function() {
      http.get(config.relayServer+'/primus/spec', function(res) {
        res.on('data', function(data) {
          var primusSpec = JSON.parse(data.toString()),
              Socket = Primus.createSocket(primusSpec),
              socket = new Socket(config.relayServer);

          socket.on('open', function () {
            console.log("Connected to relay");
          });

          socket.on('data', function (data) {
            if (socket.reserved(data.args[0])) return;
            socket.emit.apply(socket, data.args);
          });

          socket.on('reconnecting', function() {
            console.log('scheduling a reconnect.');
          });

          socket.on('reconnect', function() {
            console.log("about to reconnect");
          });

          var connection = new Connection(socket, config);
        });
      })
    });
  };
});

var workerError = function(err) {
  console.log("error", err.stack);
  try {
    // start all over again
    var killtimer = setTimeout(function() {
      var cluster = require('cluster');
      cluster.worker.disconnect();
      process.exit(1);
    }, 2000);
    killtimer.unref();
  } catch (er2) {
    // oh well, not much we can do at this point.
    console.error('Error sending error report', er2.stack);
  }
};

module.exports = Worker;

