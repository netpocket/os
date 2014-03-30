require('../../../spec_helper.js');
var pkg =require('../../../../opt/device/features/camera/manifest.js');
var fs = require('fs');

var PiCamera =require('../../../../opt/device/features/camera/models/pi_camera.js');

describe("Feature: camera", function () {
  pi(function() {
    describe("dependencies", function() {
      it("requires raspistill", function() {
        expect(fs.existsSync('/opt/vc/bin/raspistill')).to.eq(true);
      });
      it("requires raspiyuv", function() {
        expect(fs.existsSync('/opt/vc/bin/raspiyuv')).to.eq(true);
      });
    });
  });

  describe("get still", function() {
    beforeEach(function() {
      /* We don't need the Pi for this. We know the
       * defined behavior of the PiCamera model and so 
       * will stub its methods */
      PiCamera.prototype.arm = function(cb) {cb};
      PiCamera.prototype.disarm = function(cb) {cb};

      // it returns a readstream so let's return one
      PiCamera.prototype.getStill = function(cb) {
        cb(null, fs.createReadStream(__filename));
      }
    });

    it("returns jpeg as base64", function(done) {
      pkg()['get still (320x240)'].fn(function(err, res) {
        expect(err).to.be.null;
        expect(res.contentType).to.eq('image/jpg (base64)');
        expect(res.content.length > 0).to.be.true;
        done();
      });
    });
  });
});
