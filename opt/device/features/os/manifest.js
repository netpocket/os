/* Provides access to the node.js 'os' module */

var os = require('os');

module.exports = {
  'get info': {
    fn: function(cb) {
      cb(null, {
        type: os.type(),
        platform: os.platform(),
        architecture: os.arch(),
        release: os.release(),
        cpus: os.cpus()
      });
    }
  },
  'get memory stats': {
    fn: function(cb) {
      cb(null, {
        total: os.totalmem(),
        free: os.freemem()
      });
    }
  },
  'get uptime': {
    fn: function(cb) {
      cb(null, os.uptime());
    }
  }
};
