/* Camera module
 *
 * https://github.com/raspberrypi/userland/blob/master/host_applications/linux/apps/raspicam/RaspiCamDocs.odt
 *
 * these experiments will start to break request/response
 * patterns and help us to start to support streaming too
 * */

var exec = require('child_process').exec;
var fs = require('fs');

module.exports = function(device) {
  return {
    'get still': {
      fn: function(cb) {
        exec('/opt/vc/bin/raspistill -w 640 -h 480 -o - | base64 > /tmp/still.jpg.base64', function(err, stdout, stderr){
          if (err !== null) {
            cb({
              stderr: stderr,
              message: err.message,
              stack: err.stack
            }, null);
          } else {
            cb(null, {
              contentType: 'image/jpg (base64)',
              content: fs.readFileSync('/tmp/still.jpg.base64').toString()
            });
          }
        });
      }
    },
    'get still (rgb matrix)': {
      requires: {
        pythonModule: {
          URL: "http://effbot.org/downloads/Imaging-1.1.7.tar.gz",
          Homepage: "http://effbot.org/downloads/Imaging-1.1.7.tar.gz"
        }
      },
      fn: function(cb) {
        exec('/opt/vc/bin/raspiyuv -w 640 -h 480 -o - | base64 > /tmp/still.jpg.base64', function(err, stdout, stderr){
          if (err !== null) {
            cb({
              stderr: stderr,
              message: err.message,
              stack: err.stack
            }, null);
          } else {
            cb(null, {
              contentType: 'image/jpg (base64)',
              content: fs.readFileSync('/tmp/still.jpg.base64').toString()
            });
          }
        });
      }
    }
  };
};

