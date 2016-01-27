module.exports = function (grunt) {

    // load grunt config
    require('load-grunt-config')(grunt, {

        // auto grunt.initConfig
        init: true,

        // lazy-load tasks from grunt/ folder
        jitGrunt: {
            staticMappings: {
                s3: 'grunt-aws'
            }
        }
    });
};
