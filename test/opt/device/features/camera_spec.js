require('../../../spec_helper.js');
var pkg =require('../../../../opt/device/features/camera/manifest.js');

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
  });
  describe("get still", function() {

  });
});
