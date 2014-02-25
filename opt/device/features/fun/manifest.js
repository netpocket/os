/* fun stuff like image/video 
 *
 * these experiments will start to break request/response
 * patterns and help us to start to support streaming too
 * */

var http = require('http');

var url = "http://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png";

module.exports = {
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
    fn: function(cb) {
      var chunks = [];
      http.get(url, function(res) {
        res.on('data', function (chunk) {
          chunks.push(chunk);
        });
        res.on('end', function() {
          var result = '';
          for (var i = 0, l = chunks.length; i < l; i ++) {
            var v = chunks[i];
            result += v.toString('base64');
          }
          cb(null, {
            contentType: 'image/png',
            content: result
          });
        });
      }).on('error', function(e) {
        cb(e, null);
      });
    }
  }
};

