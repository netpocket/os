var Connection = (function(socket, config, device) {
  "use strict";
  var self = this;
  this.socket = socket;

  var emit = this.emit = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    socket.write({args:args});
  };

  socket.on('relay error', function(data) {
    console.log("relay error", data);
  });

  socket.on('please identify', function() {
    emit("i am a netpocketos device", config.token, device);
  });

});

module.exports = Connection;

