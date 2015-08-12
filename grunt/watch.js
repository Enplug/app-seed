module.exports = {

    options: { livereload: false },

    // Watch for JS changes and re-build app JS
    scripts: {
        files: ['src/<%= project %>/js/**/*.js'],
        tasks: ['build-js']
    },

    // Watch for SASS changes and recompile CSS files
    sass: {
        files: ['src/<%= project %>/sass/**/*.scss'],
        tasks: ['build-css']
    },

    templates: {
        files: ['src/<%= project %>/templates/**/*.html'],
        tasks: ['build-templates', 'build-js']
    },

    html: {
        files: ['src/<%= project %>/index.html'],
        tasks: ['build-html']
    },

    livereload: {
        files: [ 'dist/**' ],
        options: { livereload: true }
    }
};
