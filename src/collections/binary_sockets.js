_ = require('underscore')._,
Backbone = require('backbone'),
BinarySockets = Backbone.Collection.extend({
  model: require(__dirname+'/../models/binary_socket.js')
});

module.exports = BinarySockets;
