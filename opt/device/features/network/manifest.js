/* Provides some network related stuff */

var os = require('os');
var exec = require('child_process').exec;

module.exports = function(device) {
  var actions = {
    'scan wifi networks': {
      fn: function(cb) {
        exec('iwlist wlan0 scan', function(err, stdout, stderr){
          if (err !== null) {
            cb({
              stderr: stderr,
              message: err.message,
              stack: err.stack
            }, null);
          } else {
            cb(null, {
              contentType: 'text/plain',
              content: stdout
            });
          }
        });
      }
    },
    'setup wifi': {
      fn: function(cb) {
        /* 2 bash commands to join a new WPA2 network
         *
         * wpa_passphrase LaundryRoom columbus > /etc/wpa_supplicant/wpa_supplicant.conf
         * wpa_supplicant -B -iwlan0 -c/etc/wpa_supplicant.conf -Dwext && dhclient wlan0
         */
        actions['scan wifi networks'].fn(function(err, res) {
          if (err !== null) { return cb(err, null); }
          cb(null, res);
        });
      },
      /* this action is interactive, presenting a form, and allowing the user to interact
       * it also shows how to construct interactions in this way.
       *
       * notice that inputs come back as arguments in the order in which they
       * are provided in the form.elements array */
      form: {
        json2html: {
          transforms: [
            {
              tag: 'h3',
              html: "Choose a WPA2 network and provide the key:"
            },
            {
              tag: 'em',
              html: "Note: if you make a mistake you can plug in the ethernet cable and you can try again"
            },
            {
              tag: 'input',
              type: 'select',
              children: [
                { tag: "option", value: "freeroam", html: "Always search for the best open network" }
              ],
              html: 'Network Name'
            },
            {
              input: {
                type: 'text',
                label: 'Password'
              }
            }
          ]
        },
        submit: function(ssid, psk) {
        }
      }
    },
    'get hostname': {
      fn: function(cb) {
        cb(null, os.hostname());
      }
    },
    'get interfaces': {
      fn: function(cb) {
        cb(null, os.networkInterfaces());
      }
    },
    /* TODO dhcp failover
     * During bootup it is possible that we will not get a DHCP lease.
     * We should be detecting this case when we can't connect to the relay
     * and call this function to keep trying our best to get an IP */
    'reload network interfaces': {
      responds: false,
      fn: function() {
        exec('/etc/init.d/networking reload', function(err, stdout, stderr){
          if (err !== null) {
            cb({
              stderr: stderr,
              message: err.message,
              stack: err.stack
            }, null);
          } else {
            cb(null, {
              contentType: 'text/plain',
              content: stdout
            });
          }
        });
      }
    },
  };
  return actions;
};

