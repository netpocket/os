require('../../../spec_helper.js');
var pkg =require('../../../../opt/device/features/camera/manifest.js');

var fs = require('fs');

describe("Feature: camera", function () {
  describe("get still", function() {
    if (pi) {
      it("requires raspistill", function() {
        expect(fs.existsSync('/opt/vc/bin/raspistill')).to.eq(true);
      });
    }
  });
});
