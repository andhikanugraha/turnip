module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ["./css/style.css", "./index.html", "./js/*"],
      options: {
        livereload: true
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: '.'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['connect', 'watch']);
}