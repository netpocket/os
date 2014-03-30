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

    describe("Model: PiCamera", function() {
      var camera = null;
      beforeEach(function(done) {
        camera = new PiCamera();
        camera.arm(done);
      });
      afterEach(function(done) {
        camera.disarm(done);
      });
      describe.only("getStill()", function() {
        it("returns a readable stream (for a jpeg)", function(done) {
          this.timeout(10000);
          camera.getStill(function(err, res) {
            expect(err).to.eq(null);
            res.on('readable', function() {
              expect(res.read(1).length).to.eq(1);
              done();
            });
          });
        });
      });
    });
  });
});
