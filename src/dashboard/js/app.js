
// main deps
import angular from 'angular';
import 'angular-route';
import 'lodash';
import '@enplug/dashboard-sdk';
import '@enplug/dashboard-sdk-utils';
import '@enplug/dashboard-sdk-utils/dist/dashboard-sdk-utils.css';

// main scss
import '../sass/app.scss';

// module name
const APP_NAME = 'dashboard-app';

// create and export app instance
export default angular.module( APP_NAME, [
  'ngRoute',
  'enplug.sdk',
  'enplug.sdk.utils'
]);

