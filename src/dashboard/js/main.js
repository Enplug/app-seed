
// main dependencies
import angular from 'angular';
import 'angular-route';
import 'lodash';
import 'moment';
import '@enplug/dashboard-sdk';
import '@enplug/dashboard-sdk-utils';
import '@enplug/dashboard-sdk-utils/dist/dashboard-sdk-utils.css';

// main scss
import '../sass/app.scss';

// get app instance
import app from './app';

// route templates
import IndexTpl from '../templates/index.tpl.html';
import EditTpl from '../templates/edit.tpl.html';

// import constants
import './constants/Info';

// import services
import './services/DemoService';

// import controllers
import './controllers/IndexController';
import './controllers/EditController';

// import directives
import './directives/demo-directive';

// main module config
app.config( function( $locationProvider, $routeProvider, $compileProvider ) {
    'ngInject';

    $routeProvider
    .when( '/', {
        name: 'index',
        templateUrl: IndexTpl,
        controller: 'IndexController',
        resolve: {
            feeds: function(DemoService) {
                return DemoService.loadFeeds();
            }
        }
    })
    .when( '/setup', {
        name: 'setup',
        templateUrl: EditTpl,
        controller: 'EditController',
        resolve: {
            feed: function (DemoService) {
                return DemoService.newFeed(true);
            }
        }
    })
    .when( '/edit/:id', {
        name: 'edit',
        templateUrl: EditTpl,
        controller: 'EditController',
        resolve: {
            feed: function (DemoService, $route) {

                return DemoService.loadFeed($route.current.params.id);
            }
        }
    })
});

// initial run + setup
app.run( function( $rootScope, Info) {
    'ngInject';

});
