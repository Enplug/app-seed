module.exports = function (grunt) {

    grunt.registerTask('project', 'Set project option.', function (value) {
        grunt.config('project', value);
    });

    return {
        options: { livereload: false },

        // Watch for JS changes and re-build app JS
        scripts: {
            files: ['src/<%= project %>/js/**/*.js'],
            tasks: ['project:<%= project %>', 'build-js']
        },

        // Watch for SASS changes and recompile CSS files
        sass: {
            files: ['src/<%= project %>/sass/**/*.scss'],
            tasks: ['project:<%= project %>', 'build-css'],
            options: { livereload: true }
        },

        templates: {
            files: ['src/<%= project %>/templates/**/*.html'],
            tasks: ['project:<%= project %>', 'build-templates', 'build-js']
        },

        html: {
            files: ['src/<%= project %>/index.html'],
            tasks: ['build-html']
        },

        livereload: {
            files: ['dist/**'],
            options: {livereload: true}
        }
    };
};
