/* Provides some network related stuff */

var os = require('os');

module.exports = {
  'get hostname': {
    fn: function(cb) {
      cb(null, os.hostname());
    }
  },
  'get interfaces': {
    fn: function(cb) {
      cb(null, os.networkInterfaces());
    }
  }
};

