
// get app instance
import app from './app';

// route templates
import HomeTpl from '../templates/home.tpl.html';
import NotFoundTpl from '../templates/not.found.tpl.html';

// import various parts
import './constants';
import './services';
import './controllers';
import './directives';

// main scss
import '../sass/app.scss';

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
      controller: 'NotFoundController'
    });
});

// initial run + setup
app.run( function( $rootScope, Endpoints ) {
  'ngInject';
  console.log( Endpoints );
});
