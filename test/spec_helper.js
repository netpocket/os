var psc = require('primus-sinon-chai');
global.expect = psc.chai.expect;
global.sinon = psc.sinon;
global.pi = !!process.env.NOS_PI;
