
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
import NotFoundTpl from '../templates/not.found.tpl.html';

// import constants
import './constants/Info';

// import services
import './services/AssetService';

// import controllers
import './controllers/NotFoundController';
import './controllers/AssetIndexController';
import './controllers/EditController';

// import directives
import './directives/input-url-directive';


// main module config
app.config( function( $locationProvider, $routeProvider, $compileProvider ) {
    'ngInject';

    $routeProvider
    .when( '/', {
        name: 'list',
        templateUrl: IndexTpl,
        controller: 'AssetIndexController',
        resolve: {
            feeds: function(AssetService) {
                return AssetService.loadFeeds();
            }
        }
    })
    .when( '/setup', {
        name: 'setup',
        templateUrl: EditTpl,
        controller: 'EditController',
        resolve: {
            feed: function (AssetService) {
                return AssetService.newFeed(true);
            }
        }
    })
    .when( '/edit/:id', {
        name: 'edit',
        templateUrl: EditTpl,
        controller: 'EditController',
        resolve: {
            feed: function (AssetService, $route) {

                return AssetService.loadFeed($route.current.params.id);
            }
        }
    })
    .otherwise({
        name: 'not-found',
        templateUrl: NotFoundTpl,
        controller: 'NotFoundController'
    });
});

// initial run + setup
app.run( function( $rootScope, Info) {
    'ngInject';

});
