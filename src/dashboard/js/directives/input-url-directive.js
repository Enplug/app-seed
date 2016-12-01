
import template from '../../templates/input.url.directive.tpl.html';

import app from '../app';

export function inputUrl ( ) {

    'ngInject';

    return {
        restrict: 'E',
        scope: {
            url : '='
        },
        templateUrl: template,
        link: function( scope, element, attrs ) {

        }
    };
};

app.directive( 'inputUrl', inputUrl );
