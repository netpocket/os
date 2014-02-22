var _ = require('underscore')._,
Backbone = require('backbone'),
Connection = require('../connection.js'),
connection = null,
Device = Backbone.Model.extend({
  defaults: {
    name: "unnamed",
    features: {
      os: {
        'get uptime': {
          fn: function() {
            fcb('os:get uptime', null, require('os').uptime());
          }
        }
      },
      pkg: {
        'list': {
          fn: function() {
            /* list installed apt packages */
          }
        },
        'install': {
          fn: function() {
            /* install apt packages */
          }
        },
        'uninstall': {
          fn: function() {
            /* uninstall apt packages */
          }
        }
      }
    }
  },

  initialize: function() {
    /* Read some stuff in /etc, figure out what services
     * this device provides... whatever else you want to stuff in
     * attributes before you connect to the relay */
  },

  connect: function(socket, config) {
    this.connection = connection = new Connection(socket, config, this);
  }
});

/* Feature callback pattern */
var fcb = function(name, err, result) {
  connection.emit('feature:response:'+name, err, result);
};

module.exports = Device;
