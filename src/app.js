"use strict";

module.exports = function(socket, config) {
  socket.on('relay error', function(data) {
    console.log("relay error", data);
  });


  socket.on('please identify', function() {

    socket.write({
      args: ["i am a netpocketos device", config.token, {
        capabilities: [],
        status: {
          idle: true
        }
      }]
    });
  });
};
