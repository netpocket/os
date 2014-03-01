// Could send base64 to browser and work on it there
// http://blog.danguer.com/2011/10/24/base64-binary-decoding-in-javascript/

// nice explanation of readable streams
// http://codewinds.com/blog/2013-08-04-nodejs-readable-streams.html

// official docs about it
// http://nodejs.org/api/stream.html#stream_class_stream_readable

// more jump off points
// http://stackoverflow.com/questions/1423925/changing-rgb-color-values-to-represent-a-value
// http://polymathprogrammer.com/2008/08/04/basic-colour-theory-for-programmers/
// http://en.wikipedia.org/wiki/RGB#Numeric_representations

var fs = require('fs');
var file = process.argv[2];
var width = parseInt(process.argv[3]);
var height = parseInt(process.argv[4]);

if (!height) {
  console.error("  Usage: node <script> <an rgb888 file> <width> <height>");
  process.exit(1);
}

var time = new Date();

var readStream = fs.createReadStream(file);
readStream.on('readable', function() {
  var chunk;
  while (null !== (chunk = readStream.read(3))) {
    // RGB enters as raw byte data in order of RGBRGBRGB
    // The pixel order is from left to right and from top to bottom.
    // This octet will first be R
    // then G
    // then B
    // and so on for as long as the width
    // then we will see the same... over and over until we've gone through height
    var r = chunk.readUInt8(0);
    var g = chunk.readUInt8(1);
    var b = chunk.readUInt8(2);
    showMatrix(r,g,b);
  }
}).on('end', function() {
  console.log("Done reading in %d seconds", ((new Date()) - time) / 1000);
});

// we start at the top-left
// var row = 1;
var col = 1;

function pad(i) {
  return ("000" + i).slice(-3);
}

console.log("Width: "+ width+ "\nHeight: "+ height);

var showMatrix = function(r,g,b) { // R G B as integers from 0 to 255
  // Print triplet
  process.stdout.write("("+pad(r)+','+pad(g)+','+pad(b)+')');
  // process.stdout.write(pad(col));

  // We've gone through all columns if our column count == the width ...
  if (col === width) {
    // Print a newline
    process.stdout.write('\n');
    // process.stdout.write('End of row '+row+'\n');

    // Reset the column counter
    col = 1;

    // Track the row too
    // row++;
  } else {
    // Print a comma
    process.stdout.write(',');
    ++col; // We handled an RGB triplet, so increment column counter
  }
};
