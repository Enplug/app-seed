
// main deps
import angular from 'angular';
import 'lodash';
import '@enplug/dashboard-sdk';
import '@enplug/dashboard-sdk-utils';
import '@enplug/dashboard-sdk-utils/dist/dashboard-sdk-utils.css';

// main templates
import HomeTpl from '../templates/home.tpl.html';
import NotFoundTpl from '../templates/not.found.tpl.html';

// route controllers
import NotFoundController from './controllers/NotFoundController';

// module name
const APP_NAME = 'dashboard-app';

// create app instance
const app = angular.module( 'dashboard-app', [
  'enplug.sdk',
  'enplug.sdk.utils'
]);

// main module config
app.config( function( $locationProvider, $routeProvider ) {

  $routeProvider
    .when( '/', {
      name: 'home',
      templateUrl: HomeTpl
    })
    .otherwise({
      templateUrl: NotFoundTpl,
      controller: NotFoundController
    });
});

// initial run + setup
app.run( function( $rootScope ) {

});

app.controller( 'NotFoundController', NotFoundController );

export default APP_NAME;
