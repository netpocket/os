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
          fn: function(cb) {
            cb(null, require('os').uptime());
          }
        }
      },
      pkg: {
        'list': {
          fn: function(cb) {
            /* list installed apt packages */
            cb("not yet implemented", null);
          }
        },
        'install': {
          fn: function(cb) {
            /* install apt packages */
            cb("not yet implemented", null);
          }
        },
        'uninstall': {
          fn: function(cb) {
            /* uninstall apt packages */
            cb("not yet implemented", null);
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
  },

  /* Relay brings device a payload from browsers and/or other
   * devices through this method. Respond in (err, res)
   * style using the callback provided.
   * Note: in this method treat `err` like a HTTP status code
   * This is funnelled back to the originator of the payload */
  inboundPayload: function(payload, cb) {
    try {
      var feature = this.attributes.features[payload.args[0]];
      var task = feature[payload.args[1]];
      task.fn(function(err, res) {
        cb(null, {
          cmd: "feature response",
          args: payload.args,
          err: err,
          res: res
        });
      });
    } catch (e) {
      cb({
        error: 400,
        reason: "Bad Request",
        detail: "It's not clear what you want me to do. Giving up."
      }, null);
    }
  }
});

module.exports = Device;
