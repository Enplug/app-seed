'use strict';

var
    appConfig = require( './webpack.config.app' ),
    dashConfig = require( './webpack.config.dashboard' );

module.exports = [
    appConfig,
    dashConfig
];
