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
    'get still (320x240)': {
      fn: function(cb) {
        exec('/opt/vc/bin/raspistill -w 320 -h 240 -o - | base64 > /tmp/still.jpg.base64', function(err, stdout, stderr){
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
    'get rgb triplets (64x48)': {
      requires: {
        python: true,
        pythonModule: {
          homepage: "http://www.pythonware.com/products/pil/",
          camera: "http://effbot.org/downloads/Imaging-1.1.7.tar.gz"
        }
      },
      fn: function(cb) {
        exec('/opt/vc/bin/raspiyuv -w 64 -h 48 -o /tmp/still.rgb', function(err, stdout, stderr){
          if (err !== null) {
            cb({
              stderr: stderr,
              message: err.message,
              stack: err.stack
            }, null);
          } else {
            exec('node /opt/netpocketos/opt/device/features/camera/rgbMatrix.js /tmp/still.rgb 64 48', function(err2, stdout2, stderr2){
              if (err2 !== null) {
                cb({
                  stderr: stderr2,
                  message: err2.message,
                  stack: err2.stack
                }, null);
              } else {
                cb(null, {
                  contentType: 'text/plain',
                  content: stdout2
                });
              }
            });
          }
        });
      }
    }
  };
};

