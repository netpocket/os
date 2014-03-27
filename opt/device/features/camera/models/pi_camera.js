var Backbone = require('backbone'),
cp = require('child_process'),
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
      '-s', // Listen for SIGUSR1
      '-t', '0', // Never timeout
      '-w', '320',
      '-h', '240',
      '-o', '/tmp/still%d.jpg'
    ]);
    // Keepalive
    this.child.on('close', function() {
      this.set('armed', false);
      this.disarm(function() {
        this.arm(function() {});
      }.bind(this));
    }.bind(this));
    this.set('armed', true);
    cb(null, "PiCamera is armed.");
  },

  getStill: function(cb) {
    setTimeout(function() {
      cb('/tmp/still'+(++this.count)+'.jpg');
    }, 500);
    this.child.kill('SIGUSR1');
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
