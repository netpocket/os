var fs = require('fs'),
_ = require('underscore')._,
Backbone = require('backbone'),
Connection = require('../connection.js'),
connection = null,
Device = Backbone.Model.extend({

  initialize: function() {
    this.loadDeviceAttributes();
    this.loadFeatures();
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
      this.attributes.features[name] = require(featuresDir+'/'+name+'/manifest.js');
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
      var feature = this.attributes.features[payload.args[0]];
      var task = feature[payload.args[1]];
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
        detail: "It's not clear what you want me to do. Giving up."
      }, null);
    }
  }
});

module.exports = Device;
