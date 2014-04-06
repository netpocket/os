_ = require('underscore')._,
Backbone = require('backbone'),
BinaryClient = require("binaryjs").BinaryClient,
BinarySocket = Backbone.Model.extend({
  initialize: function() {
    var client = this.client = new BinaryClient(this.get('server')+':'+this.get('port')+'/');
    client.on('stream', function(stream, meta) {
      console.log("got binary stream data...");
    });

    client.on('open', function() {
      console.log("established a connection");
    });
  }
});

module.exports = BinarySocket;
