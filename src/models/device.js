var fs = require('fs'),
_ = require('underscore')._,
Backbone = require('backbone'),
Connection = require('../connection.js'),
os = require('os'),
PiCamera = require(__dirname+'/pi_camera.js'),
BinarySockets = require(__dirname+'/../collections/binary_sockets.js'),
Device = Backbone.Model.extend({
  configFile: __dirname+'/../../etc/device.json',
  camera: new PiCamera(),

  initialize: function() {
    this.loadAttributes();
    this.loadFeatures();
    this.binarySockets = new BinarySockets();

    // i just disabled this code here
    // that is what was taking camera snapshots etc
    //
    // i want the user to be able to give his things a role
    // or a purpose in this way....
    // also the features thing will probably go the fuck away, it is 
    // mostly useless in terms of what IoT will be / is for
    //
    /* Load loops / programs / modules ??? 
    var self = this;
    this.camera.arm(function() {
      setInterval(function() {
        self.findAction([
          'camera', 'get still (320x240)'
        ]).fn(function (err, res){
          self.set('display', res);
        });
      }, 3000);
    });
    */
  },

  loadAttributes: function() {
    _.extend(this.attributes, require(this.configFile));
  },

  persistAttributes: function(cb) {
    fs.writeFile(this.configFile, JSON.stringify(this.attributes), function(err) {
      if (err) { cb(err); } else if (typeof cb === "function") { cb(null); }
    });
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
    this.connection = new Connection(socket, config, this);
  },

  findAction: function (path) {
    var obj = this.get('features');
    _.each(path, function (i) {
      if (typeof obj[i] !== "undefined") {
        obj = obj[i];
      }
    });
    return obj;
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
        task = this.findAction(payload.args);
      }
      task.fn(function(err, res) {
        cb(null, {
          cmd: payload.cmd.replace(' request', ' response'),
          args: payload.args,
          err: err,
          res: res
        });
      }, payload);
    } catch (e) {
      cb({
        error: 400,
        reason: "Bad Request",
        message: e.message,
        stack: e.stack.split('\n')
      }, null);
    }
  }
});

module.exports = Device;
