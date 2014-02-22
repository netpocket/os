var _ = require('underscore')._,
Backbone = require('backbone'),
Connection = require('../connection.js'),
Device = Backbone.Model.extend({
  defaults: {
    name: "unnamed",
    services: [
      {
        name: 'some service',
        actions: [
          {
            label:'some action',
            message: 'socket msg'
          }
        ]
      }
    ]
  },

  initialize: function() {
    /* Read some stuff in /etc, figure out what services
     * this device provides... whatever else you want to stuff in
     * attributes before you connect to the relay */
  },

  connect: function(socket, config) {
    this.connection = new Connection(socket, config, this);
  }
});

module.exports = Device;
