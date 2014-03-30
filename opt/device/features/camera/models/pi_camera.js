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

  tempFilePath: '/tmp/_still.jpg',

  /* Arming the PiCamera means to run raspistill with
   * the -s argument which leaves the camera on and ready
   * to take stills on SIGUSR1 */
  arm: function(cb) {
    if (this.child !== null) {
      return cb("Already armed.", null);
    }
    this.child = spawn('/opt/vc/bin/raspistill', [
      '-v', // Be verbose so we know when to fire events
      '-k', // Listen for enter key
      '-t', '0', // Never timeout
      '-w', '320',
      '-h', '240',
      '-o', this.tempFilePath
    ]);

    // Listen to output
    this.child.stderr.on('data', this.message.bind(this));

    // Keepalive
    this.child.on('close', function() {
      this.child.removeAllListeners();
      this.set('armed', false);
      this.disarm(function() {
        this.arm(function() {});
      }.bind(this));
    }.bind(this));
    
    // And die with process TODO is this required? 
    process.on('exit', function() {
      this.child.kill('SIGINT');
    }.bind(this));

    this.set('armed', true);
    cb(null, "PiCamera is armed.");
  },

  matchers: {
    finishedCapture: new RegExp("Finished capture (\\d+)")
  },

  /* Here we'll sniff the subprocess's verbose output
   * in order to know when to trigger events */
  message: function(data) {
    var str = data.toString();
    if (str.match(this.matchers.finishedCapture)) {
      this.trigger("capture:finished");
    }
  },

  getStill: function(cb) {
    if (! this.isArmed()) {
      return cb("Not armed.", null);
    }

    // If capture doesn't complete after 10 seconds, return an error
    var timeout = setTimeout(function() {
      cb('capture timed out');
    }, 10000);

    this.once('capture:finished', function(id) {
      clearTimeout(timeout);
      cb(null, fs.createReadStream(this.tempFilePath));
    }.bind(this));

    // Take a picture
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
