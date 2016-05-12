
// main deps
import angular from 'angular';
import enplugSdk from 'enplug-dashboard-sdk';
import enplugSdkUtils from 'enplug-dashboard-sdk-utils';

// main templates
import HomeTpl from '../templates/home.tpl.html';
import NotFoundTpl from '../templates/not.found.tpl.html';

// route controllers
import NotFoundController from './controllers/NotFoundController';

// module name
const APP_NAME = 'dashboard-app';

// create app instance
const app = angular.module( 'dashboard-app', [
//    'enplug.sdk',
//    'enplug.sdk.utils'
    enplugSdk,
    enplugSdkUtils
]);

// main module config
app.config(function( $locationProvider, $routeProvider ) {
    'use strict';

    $routeProvider
        .when( '/', {
            name: 'home',
            templateUrl: HomeTpl
        })
        .otherwise({
            templateUrl: NotFoundTpl,
            controller: NotFoundController
        })

});

// initial run + setup
app.run(function( $rootScope ) {

});

export default APP_NAME;
