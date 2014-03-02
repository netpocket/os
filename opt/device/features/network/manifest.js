/* Provides some network related stuff */

var os = require('os');
var exec = require('child_process').exec;

module.exports = function(device) {
  var actions = {
    'scan wifi networks': {
      fn: function(cb) {
        require('iwlist')('wlan0').scan(function(err, res) {
          if (err !== null) {
            cb({
              stderr: stderr,
              message: err.message,
              stack: err.stack
            }, null);
          } else {
            cb(null, res);
          }
        });
      }
    },
    'configure wifi': {
      /* this action is interactive, presenting a form, and allowing the user to interact
       * it also shows how to construct interactions in this way. */
      modal: {
        okText: "Save"
      },
      /* 2 bash commands to join a new WPA2 network
       *
       * wpa_passphrase LaundryRoom columbus > /etc/wpa_supplicant/wpa_supplicant.conf
       * wpa_supplicant -B -iwlan0 -c/etc/wpa_supplicant.conf -Dwext && dhclient wlan0
       */
      submit: {
        fn: function(cb, payload) {
          var essid = payload.params[0];
          var psk = payload.params[1];
          if (essid === "Choose Network") {
            cb("Invalid selection", null);
          } else if (essid === "any") {
            cb("Only WPA2 network are currently supported right now.", null);
          } else if (psk.length < 8) {
            cb("Passphrase is too short (must be at least 8 characters)", null);
          } else if (psk.length >= 8) {
            exec("wpa_passphrase "+essid+" "+psk+" > /etc/wpa_supplicant/wpa_supplicant.conf", function(error, stdout, stderr) {
              cb(null, "Set to use "+essid+" from now on with the supplied password. "+
                 "To apply changes immediately, press escape and reload network interfaces from the the main menu.");
            });
          }
        }
      },
      fn: function(cb) {
        require('iwlist')('wlan0').scan(function(err, res) {
          if (err !== null) {
            cb({
              message: err.message,
              stack: err.stack
            }, null);
          } else {
            var _ = require('underscore')._;
            var transform = [{
              tag: 'h3',
              html: "Choose a WPA2 network and provide the key:"
            },{
              tag: 'em',
              html: "Note: if you make a mistake you can plug in the ethernet cable and retry"
            },{
              tag: 'select',
              children: [
                { tag: 'option', selected:'selected', html: 'Choose Network' },
                { tag: 'option', value: 'any', html: 'Any nearby unsecured network' }
              ].concat(_.map(res, function(n) {
                return { tag: 'option', value: n.essid, html: n.essid+' (strength: '+n.signal+')' };
              }))
            },{
              tag: 'input',
              placeholder: "Pre-shared Key",
              type: 'text',
              label: 'Password'
            }];

            cb(null, {
              contentType: 'nos/form/json2html',
              transform: transform,
              data: [null]
            });
          }
        });
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
      fn: function(cb) {
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

