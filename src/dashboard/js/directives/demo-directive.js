import template from '../../templates/demo.directive.tpl.html';

import app from '../app';

export function demoDirective ( ) {

    'ngInject';

    return {
        restrict: 'E',
        templateUrl: template,
        scope: {
            content: '='
        },
        link: function (scope, element, attrs) {

            // Directive scope methods, functions, etc go here..

        }
    };
};

app.directive( 'demoDirective', demoDirective );
