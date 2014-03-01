// Could send base64 to browser and work on it there
// http://blog.danguer.com/2011/10/24/base64-binary-decoding-in-javascript/

// nice explanation of readable streams
// http://codewinds.com/blog/2013-08-04-nodejs-readable-streams.html

// official docs about it
// http://nodejs.org/api/stream.html#stream_class_stream_readable

var fs = require('fs');
var Buffer = require('buffer').Buffer;
var constants = require('constants');

var file = process.argv[2];
var width = process.argv[3];
var height = process.argv[4];

if (!height) {
  console.error("  Usage: node <script> <a yuv420p file> <width> <height>");
  process.exit(1);
}

var readStream = fs.createReadStream(file);
readStream.on('readable', function() {
  var chunk;
  while (null !== (chunk = readStream.read(1))) {
    gotOctet(chunk[0]);
  }
}).on('end', function() {
  console.log("Done reading");
});

var max = 0;



var gotOctet = function(octet) {
  if (octet > max) {
    max = octet;
    console.log(octet);
  }
};
