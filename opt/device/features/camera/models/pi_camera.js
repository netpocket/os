var Backbone = require('backbone'),
cp = require('child_process'),
fs = require('fs'),
exec = cp.exec,
spawn = cp.spawn,
PiCamera = Backbone.Model.extend({
  defaults: {
    armed: false,
    width: '320',
    height: '240',
    tempFilePath: '/tmp/_still.jpg'
  },

  isArmed: function() {
    return this.get('armed');
  },

  /* Arming the PiCamera means to run raspistill with
   * the -k argument which leaves the camera on and ready
   * to take stills when stdin gets a newline */
  arm: function(cb) {
    if (this.isArmed()) {
      return cb("Already armed.", null);
    }
    this.child = spawn('/opt/vc/bin/raspistill', [
      '-v', // Be verbose so we know when to fire events
      '-k', // Listen for enter key
      '-t', '0', // Never timeout
      '-w', this.get('width'),
      '-h', this.get('height'),
      '-o', this.get('tempFilePath')
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
      cb(null, fs.createReadStream(this.get('tempFilePath')));
    }.bind(this));

    // Take a picture
    this.child.stdin.write("\n");
  },

  /* Disarming the PiCamera is a matter of sending the child process
   * an interrupt signal and setting armed to false */
  disarm: function(cb) {
    this.child.removeAllListeners();
    this.child.kill("SIGINT");
    this.set('armed', false);
    cb(null, "PiCamera is disarmed.");
  }
});

module.exports = PiCamera;
