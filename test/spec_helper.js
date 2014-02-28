var psc = require('primus-sinon-chai');
global.expect = psc.chai.expect;
global.sinon = psc.sinon;

/* Add device tests here -- these tests
 * execute during initial install */
global.pi = function(cb) {
  if (process.env.NOS_PI) cb();
};
