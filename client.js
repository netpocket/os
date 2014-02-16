'use strict';

var config = {
  relayServer: "http://luchia.local:1337"
};

var Primus = require('primus')
  , http = require('http');

var buildSocket = function(primusSpec) {
  var server = http.createServer()
    , primus = new Primus(server, primusSpec)
    , Socket = primus.Socket
    , socket = new Socket(config.relayServer);


  socket.on('open', function () {
    console.log("Connected to relay");
  });

  socket.on('data', function (data) {
    if (socket.reserved(data.args[0])) return;
    socket.emit.apply(socket, data.args);
  });

  socket.on('ping', function() {
    console.log("ping");
    socket.write({
      args: ["pong"]
    });
  });

  socket.on('reconnecting', function() {
    console.log('scheduling a reconnect.');
  });

  socket.on('reconnect', function() {
    console.log("about to reconnect");
  });
}

var eventuallyConnect = function() {
  http.get(config.relayServer+'/primus/spec', function(res) {
    res.on('data', function(data) {
      buildSocket(JSON.parse(data.toString()));
    });
  }).on('error', function(e) {
    setTimeout(eventuallyConnect, 1000);
  });
}

process.on('uncaughtException', function (exception) {
  eventuallyConnect();
});

eventuallyConnect();
