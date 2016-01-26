module.exports = function (grunt) {

    // load grunt config
    require('load-grunt-config')(grunt, {

        // auto grunt.initConfig
        init: true,

        // automatically lazy-loads tasks
        jitGrunt: true
    });

};
