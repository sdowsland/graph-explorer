module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['browserify', 'watch']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            main: {
                src: 'src/main.js',
                dest: 'dist/graph-explorer.js',
                options: {
                    exclude: ['d3']
                }
            }
        },
        watch: {
            files: 'src/*',
            tasks: ['default']
        }
    });
};