/* Provides some network related stuff */

var os = require('os');
var exec = require('child_process').exec;

module.exports = function(device) {
  return {
    'scan wifi': {
      fn: function(cb) {
        exec('iwlist wlan0 scan', function(err, stdout, stderr){
          if (err !== null) {
            cb({
              stderr: stderr,
              message: err.message,
              stack: err.stack
            }, null);
          } else {
            cb(null, {
              contentType: 'text/plain',
              content: stdout
            });
          }
        });
      }
    },
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
};

