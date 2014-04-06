var piUserHost = "root@172.20.10.9";
// var piUserHost = "root@192.168.0.107";
var fs = require('fs');
var sources = [
  'server.js',
  'src/**/*.js',
  'opt/**/*.js'
];

var js = sources.concat('test/**/*.js');

module.exports = function(grunt) {
  grunt.initConfig({
    simplemocha: {
      options: {
        timeout: 3000,
        globals: [
          'expect',
          'sinon'
        ],
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'dot'
      },

      all: { src: ['test/**/*_spec.js'] }
    },

    jshint: {
      all: sources,
      options: {
        force: true
      }
    },

    watch: {
      scripts: {
        files: js,
        tasks: [
          'jshint',
          'simplemocha',
          'cover',
        ]
      },
      pi: {
        options: { spawn: false },
        files: js,
        tasks: [/* transfers the file */]
      },
    }
  });

  grunt.event.on('watch', function(action, filepath, target) {
    if (target === 'pi') {
      var child = null;
      remotePath = '/opt/netpocketos/'+filepath;
      if (fs.lstatSync(filepath).isDirectory()) {
        // Make directory remotely
        child = grunt.util.spawn({
          cmd: "ssh",
          args: [
            piUserHost,
            "mkdir",
            remotePath
          ]
        }, function() {
          grunt.log.writeln("Created folder "+remotePath);
        });
      } else {
        // Transfer the file
        child = grunt.util.spawn({
          cmd: "scp",
          args: [
            filepath,
            piUserHost+':'+remotePath
          ]
        }, function(err) {
          if (err !== null) {
            grunt.log.writeln("Attempted to transfer "+remotePath);
          }
        });
      }
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    }
  });

  grunt.registerTask('default', [
    'jshint',
    'simplemocha',
    'cover',
    'watch'
  ]);

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('cover', function() {
    var done = this.async();
    var reportPath = '/coverage/lcov-report/index.html';
    var child = grunt.util.spawn({cmd: 'istanbul', args: ['cover', 'node_modules/mocha/bin/_mocha', 'test/**/*.js']}, function() {
      grunt.log.writeln('file://'+__dirname+reportPath);
      done();
    });
  });
};
