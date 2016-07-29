
// main deps
import angular from 'angular';
import 'angular-route';
import 'lodash';
import '@enplug/dashboard-sdk';
import '@enplug/dashboard-sdk-utils';
import '@enplug/dashboard-sdk-utils/dist/dashboard-sdk-utils.css';

// main templates
import HomeTpl from '../templates/home.tpl.html';
import NotFoundTpl from '../templates/not.found.tpl.html';

// main scss
import '../sass/app.scss';

// route controllers
import NotFoundController from './controllers/NotFoundController';

// module name
const APP_NAME = 'dashboard-app';

// create app instance
const app = angular.module( 'dashboard-app', [
  'ngRoute',
  'enplug.sdk',
  'enplug.sdk.utils'
]);

// main module config
app.config( function( $locationProvider, $routeProvider, $compileProvider ) {
  'ngInject';

  if ( EP_ENV === 'prod' ) {
    $compileProvider.debugInfoEnabled( false );
  }

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
  'ngInject';

});

app.controller( 'NotFoundController', NotFoundController );

export default APP_NAME;
