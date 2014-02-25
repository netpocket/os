/* Provides access to the node.js 'os' module */

var os = require('os');

module.exports = {
  'get uptime': {
    fn: function(cb) {
      cb(null, os.uptime());
    }
  }
};
