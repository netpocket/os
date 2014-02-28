var sources = [
  'Gruntfile.js',
  'server.js',
  'src/**/*.js'
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
        tasks: ['default']
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
      var child = grunt.util.spawn({
        cmd: "scp",
        args: [
          filepath,
          'root@192.168.0.107:/opt/netpocketos/'+filepath
        ]
      }, function() {
        grunt.log.writeln("Transferred "+filepath);
      });
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
