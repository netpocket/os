/* fun stuff like image/video 
 *
 * these experiments will start to break request/response
 * patterns and help us to start to support streaming too
 * */

var http = require('http');

var url = "http://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png";

module.exports = function(device) {
  return {
    'tux.png (url)': {
      fn: function(cb) {
        cb(null, {
          contentType: 'image/url',
          content: url
        });
      }
    },
    'tux.png (base64)': {
      /* We'll be sending the tux image as base64 over websockets for
       * display in a canvas or img tag on the other side */
      stream: true,
      fn: function(cb, stream) {
        http.get(url, function(res) {
          res.on('data', function (chunk) {
            stream.write('stream', chunk, {});
          });
          res.on('end', function() {
            cb(null, {
              stream: 'done'
            });
          });
        }).on('error', function(e) {
          cb(e, null);
        });
      }
    }
  };
};

