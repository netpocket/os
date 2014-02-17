"use strict";

module.exports = function(socket, config) {
  var emit = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    console.log("emitting", args);
    socket.write({args:args});
  };

  socket.on('relay error', function(data) {
    console.log("relay error", data);
  });

  socket.on('please identify', function() {
    console.log("relay is asking for identification");
    emit("i am a netpocketos device", config.token, {});
  });
};
