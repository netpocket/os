/* fun stuff like image/video 
 *
 * these experiments will start to break request/response
 * patterns and help us to start to support streaming too
 * */

var exec = require('child_process').exec;
var fs = require('fs');

module.exports = function(device) {
  return {
    'get still': {
      meta: {
        docs_url: 'https://github.com/raspberrypi/userland/blob/master/host_applications/linux/apps/raspicam/RaspiCamDocs.odt'
      },
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
    }
  };
};

