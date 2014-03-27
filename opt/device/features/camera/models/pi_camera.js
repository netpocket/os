var Backbone = require('backbone'),
cp = require('child_process'),
fs = require('fs'),
exec = cp.exec,
spawn = cp.spawn,
PiCamera = Backbone.Model.extend({
  defaults: {
    armed: false
  },

  initialize: function() {
    this.child = null;
    return false;
  },

  isArmed: function() {
    return this.get('armed');
  },

  /* Arming the PiCamera means to run raspistill with
   * the -s argument which leaves the camera on and ready
   * to take stills on SIGUSR1 */
  arm: function(cb) {
    if (this.child !== null) {
      return cb("Already armed.", null);
    }
    this.count = 0;
    this.child = spawn('/opt/vc/bin/raspistill', [
      '-k', // Listen for enter key
      '-t', '0', // Never timeout
      '-w', '320',
      '-h', '240',
      '-o', '-' // Write to stdout
    ]);
    // Keepalive
    this.child.on('close', function() {
      this.set('armed', false);
      this.disarm(function() {
        this.arm(function() {});
      }.bind(this));
    }.bind(this));
    // And die with process
    process.on('exit', function() {
      this.child.kill('SIGINT');
    }.bind(this));
    this.set('armed', true);
    cb(null, "PiCamera is armed.");
  },

  getStill: function(cb) {
    var buf = "";
    var base64 = spawn('base64');

    var onCamData = function(data) {
      base64.stdin.write(data);
    };

    // Setup pipe
    this.child.stdout.on('data', onCamData);

    /* We need to know when we are done receiving data
     * so we'll use a timer with a maximum timeout. If this
     * maximum is exceeded, we assume the capture is complete */
    var silenceCheck = null;
    var maxSilence = null;
    var diffTime = null;
    // Where we'll store the last time we got data
    var lastOut = null;
    var done = function() {
      /* we're done when the silence (the time since lastOut) is more than
       * what we've determined to be the maximum silence */
      var now = (new Date()).getTime();
      var timeSinceLastOut = now - lastOut;
      return (timeSinceLastOut > maxSilence);
    };
    var onBase64Data = function(data) {
      console.log("Got base64 data!");
      var now = (new Date()).getTime();
      if (lastOut === null) {
        /* We'll start to check for silence now, since this is
         * the first chunk. We don't know how long to wait, so we'll
         * timeout after a long time in case it's the only chunk */
        maxSilence = 200;
        silenceCheck = setInterval(function() {
          if (done()) {
            clearInterval(silenceCheck);
            base64.kill("SIGINT");
          }
        }, 100);
      } else {
        diffTime = now - lastOut;
        /* The amount of time it took to get this chunk, from the last chunk,
         * doubled, is likely a very good guess as to an appropriate timeout. */
        maxSilence = diffTime*2;
      }
      lastOut = now;
      buf += data;
    };

    base64.stdout.on('data', onBase64Data);

    base64.on('close', function() {
      console.log("base64 process closed!");
      this.child.stdout.removeListener('data', onCamData);
      cb(null, {
        contentType: 'image/jpg (base64)',
        content: buf
      });
    }.bind(this));

    console.log('writing newline');

    this.child.stdin.write("\n");
  },

  /* Disarming the PiCamera is a matter of sending the child process
   * an interrupt signal and setting variables to the disarmed state */
  disarm: function(cb) {
    this.child.removeAllListeners();
    this.child.kill("SIGINT");
    this.child = null;
    this.set('armed', false);
    cb(null, "PiCamera is disarmed.");
  }
});

module.exports = PiCamera;
