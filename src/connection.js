var Connection = (function(socket, config, device) {
  "use strict";
  var self = this;
  this.socket = socket;

  var emit = this.emit = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (process.env.NODE_ENV === "development") {
      console.log('emitting', args);
    }
    socket.write({args:args});
  };

  socket.on('relay error', function(data) {
    console.log("relay error", data);
  });

  socket.on('please identify', function() {
    emit("i am a netpocketos device", config.token, device);
  });

  // Request/Response (Feature Use)
  socket.on('relay', function(recipient_identifier, payload) {
    device.inboundPayload(payload, function(err, res) {
      emit(recipient_identifier, (err === null ? res : err));
    });
  });

  // Model Changes
  device.on('change', function() {
    emit('device:'+config.token+':changed', device.changed);
  });

  // Binary Socket
  this.createBinarySocket = function(name, cb) {
    var binSock = device.binarySockets.findWhere({ name:name });
    if (binSock) {
      console.log("recycled existing binary socket");
      cb(null, binSock);
    } else {
      socket.once('binary server ready', function(data) {
        binSock = device.binarySockets.add(_.extend({
          server:config.relayServer.replace('http://', 'ws://')
        }, data));
        cb(null, binSock);
      })
      emit('give me a binary server', {
        name: name
      });
    }
  }
});

module.exports = Connection;

