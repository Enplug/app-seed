module.exports = {

    options: { livereload: false },

    // Watch for JS changes and re-build app JS
    scripts: {
        files: ['src/js/**/*.js'],
        tasks: ['build-js']
    },

    // Watch for SASS changes and recompile CSS files
    sass: {
        files: ['src/sass/**/*.scss'],
        tasks: ['build-css']
    },

    templates: {
        files: ['src/templates/**/*.html'],
        tasks: ['build-templates', 'build-js']
    },

    html: {
        files: ['src/*.html'],
        tasks: ['build-html']
    },

    livereload: {
        files: [ 'dist/**' ],
        options: { livereload: true }
    }
};
