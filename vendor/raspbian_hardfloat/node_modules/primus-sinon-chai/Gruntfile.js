var fs = require('fs');

module.exports = function(grunt) {
  grunt.initConfig({
    bump: {
      options: {
        files: [
          'package.json',
          'bower.json'
        ],
        commitFiles: '-a',
        pushTo: 'origin'
      }
    }
  });
  grunt.loadNpmTasks('grunt-bump');
};

