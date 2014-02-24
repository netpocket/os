var token = process.env.NOS_TOKEN;

if (!token) { throw new Error("missing environment variable NOS_TOKEN"); }

(function() {
  "use strict";

  var config = {
    // relayServer: "http://luchia.local:1337",
    relayServer: "ncc-relay.herokuapp.com",
    secure: false,
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

    var Worker = require('./src/worker.js'),
    worker = new Worker(config);

    worker.connect();
  }
})();

