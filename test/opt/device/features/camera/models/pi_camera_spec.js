require('../../../../../spec_helper.js');
var PiCamera = require('../../../../../../opt/device/features/camera/models/pi_camera.js');

pi(function() {
  describe("PiCamera", function() {
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
