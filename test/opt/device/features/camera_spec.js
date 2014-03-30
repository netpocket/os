require('../../../spec_helper.js');
var pkg =require('../../../../opt/device/features/camera/manifest.js');

var PiCamera = require('../../../../opt/device/features/camera/models/pi_camera.js');

var fs = require('fs');

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

    describe("PiCamera", function() {
      var camera = null;
      beforeEach(function() {
        camera = new PiCamera();
      });
      describe("getStill", function() {
        it("outputs image data", function(done) {
          camera.arm(function() {
            camera.getStill(function(err, res) {
              expect(err).to.eq(null);
              expect(res.content.length > 0).to.be.true;
              done();
            });
          });
        });
      });
    });
  });
});
