/* Camera module
 *
 * https://github.com/raspberrypi/userland/blob/master/host_applications/linux/apps/raspicam/RaspiCamDocs.odt
 *
 * these experiments will start to break request/response
 * patterns and help us to start to support streaming too
 * */

var exec = require('child_process').exec;
var fs = require('fs');

var PiCamera = require(__dirname+'/models/pi_camera.js');

var camera = new PiCamera();

module.exports = function(device) {
  return {
    'arm': {
      fn: function(cb) {
        if (camera.isArmed()) {
          cb("Already armed", null);
        } else {
          camera.arm(cb);
        }
      }
    },
    'disarm': {
      fn: function(cb) {
        if (! camera.isArmed()) {
          cb("Not armed", null);
        } else {
          camera.disarm(cb);
        }
      }
    },
    'get still (320x240)': {
      fn: function(cb) {
        if (! camera.isArmed()) {
          cb("Not armed", null);
        } else {
          camera.getStill(function(path) {
            exec('cat '+path+' | base64 > /tmp/still.jpg.base64', function(err, stdout, stderr){
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
          });
        }
      }
    },
    'get rgb triplets (64x48)': {
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

