/* Camera module
 *
 * https://github.com/raspberrypi/userland/blob/master/host_applications/linux/apps/raspicam/RaspiCamDocs.odt
 *
 * these experiments will start to break request/response
 * patterns and help us to start to support streaming too
 * */

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');

module.exports = function(device) {
  return {
    'arm (for stills)': {
      fn: device.camera.arm.bind(device.camera)
    },
    'disarm (for stills)': {
      fn: device.camera.disarm.bind(device.camera)
    },
    'get still (320x240)': {
      fn: function(cb) {
        device.camera.getStill(function(err, stream) {
          if (err !== null) {
            cb(err);
          } else {
            var buf = "";
            var base64 = spawn('base64');
            stream.pipe(base64.stdin);
            base64.stdout.on('data', function(data) {
              buf += data.toString();
            });
            base64.on('close', function() {
              cb(null, {
                contentType: 'image/jpg (base64)',
                content: buf
              });
            });
          }
        });
      }
    },
    'arm (for video)': {
      fn: device.camera.arm.bind(device.camera)
    },
    'disarm (for video)': {
      fn: device.camera.disarm.bind(device.camera)
    },
    'video stream': {
      fn: function(cb) {
        device.camera.streamVideo(function(err, stream) {
          if (err !== null) {
            cb(err);
          } else {
            // stream here is a readable stream
          }
        });
      }
    },
    'get rgb triplets (64x48)': {
      fn: function(cb) {
        return cb("this code needs to be adapted to the new pattern. see get still implementation for more"); /*
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
        });*/
      }
    }
  };
};

