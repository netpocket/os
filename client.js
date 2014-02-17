'use strict';
try {
  var memwatch = require('memwatch');
  memwatch.on('leak', function(info) {
    console.log("leak", info);
  });
  console.log("Watching for memory leaks");
} catch (e) {
  console.log("Not watching for memory leaks -- npm install memwatch to do so");
}

var config = {
  relayServer: "http://luchia.local:1337"
};

var Primus = require('primus')
  , http = require('http')
  , App = require('./src/app.js');

require('getmac').getMac(function(err, res){
  if (err) throw err;
  config.token = res;
});

var buildSocket = function(primusSpec) {
  var Socket = Primus.createSocket(primusSpec)
    , socket = new Socket(config.relayServer);

  App(socket, config);

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
};

var timer = null;

var eventuallyConnect = function(domain) {
  if (timer !== null) { clearTimeout(timer); }
  http.get(config.relayServer+'/primus/spec', function(res) {
    res.on('data', function(data) {
      domain.run(function() {
        buildSocket(JSON.parse(data.toString()));
      });
    });
  }).on('error', function(e) {
    console.log("Error connecting.. will retry");
    timer = setTimeout(protectedConnection, 1000);
  });
};

var domain = require('domain');

var protectedConnection = function() {
  if (timer !== null) { clearTimeout(timer); }
  console.log("Attempting a protected connection");
  // We will buildSocket in the context of a domain
  var d = domain.create();
  d.on('error', function(err) {
    console.log("domain error", err);
    timer = setTimeout(protectedConnection, 1000);
  });
  eventuallyConnect(d);
};

protectedConnection();
