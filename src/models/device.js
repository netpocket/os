var fs = require('fs'),
_ = require('underscore')._,
Backbone = require('backbone'),
Connection = require('../connection.js'),
connection = null,
os = require('os'),
Device = Backbone.Model.extend({

  initialize: function() {
    this.loadDeviceAttributes();
    this.loadFeatures();
    /* Just a change event...
    setInterval(function() {
      this.set('uptime', os.uptime());
    }.bind(this), 10000); */
  },

  loadDeviceAttributes: function() {
    var deviceConf = __dirname+'/../../etc/device.json';
    this.attributes = require(deviceConf);
  },

  loadFeatures: function() {
    this.attributes.features = {};
    /* Load included features */
    var featuresDir = __dirname+'/../../opt/device/features';
    _.each(fs.readdirSync(featuresDir), function(name) {
      var modulePath = featuresDir+'/'+name+'/manifest.js';
      if (fs.existsSync(modulePath)) {
        var mod = require(modulePath);
        if (typeof mod === "function") {
          this.attributes.features[name] = mod(this);
        } else if (typeof mod === "object") {
          this.attributes.features[name] = mod;
        }
      }
    }.bind(this));
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
      var task = { fn: function(callback) {
        throw new Error('Command not found: '+payload.cmd);
      } };
      if (payload.cmd === "feature request") {
        var feature = this.attributes.features[payload.args[0]];
        task = feature[payload.args[1]];
      }
      task.fn(function(err, res) {
        cb(null, {
          cmd: payload.cmd.replace(' request', ' response'),
          args: payload.args,
          err: err,
          res: res
        });
      });
    } catch (e) {
      cb({
        error: 400,
        reason: "Bad Request",
        message: e.message,
        stack: e.stack
      }, null);
    }
  }
});

module.exports = Device;
