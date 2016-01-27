module.exports = function (grunt) {

    grunt.registerTask('environment', 'Updates grunt config based on environment selection.', function () {

        // Must prompt user for environment
        grunt.task.requires('prompt:environment');

        // Get selected environment from prompt result
        var env = grunt.config('env');
        if (env) {
            try {
                var envConfig = grunt.file.readJSON('grunt/environment.json');
                if (envConfig[env]) {
                    grunt.config.merge(envConfig[env]);
                    return true;
                } else {
                    grunt.log.error('No config found for environment: ' + JSON.stringify(env));
                    return false;
                }
            } catch (e) {
                grunt.log.error('Error setting environment config: ' + e.message);
                return false;
            }
        } else {
            grunt.log.error('No environment selected.');
            return false;
        }
    });
};
