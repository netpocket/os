var token = process.env.NOS_TOKEN;
var relayServer = process.env.RELAY_SERVER;

if (!token) { throw new Error("missing environment variable NOS_TOKEN"); }
if (!relayServer) { throw new Error("missing environment variable RELAY_SERVER"); }

(function() {
  "use strict";

  var config = {
    relayServer: relayServer,
    token: token
  };

  var cluster = require('cluster');
  if (cluster.isMaster) {

    // Only need one worker
    cluster.fork();

    cluster.on('disconnect', function(worker) {
      console.error("disconnect!");
      cluster.fork();
    });

  } else {
    // the worker

    try {
      var memwatch = require('memwatch');
      memwatch.on('leak', function(info) {
        console.log("leak", info);
      });
      console.log("Watching for memory leaks");
    } catch (e) {
      console.log("Not watching for memory leaks -- npm install memwatch to do so");
    }

    console.log("Connecting using configuration: ", config);
    var Worker = require('./src/worker.js'),
    worker = new Worker(config);

    worker.connect();
  }
})();

