(function() {
  "use strict";

  var config = {
    relayServer: "http://luchia.local:1337",
    token: "mytoken"
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

