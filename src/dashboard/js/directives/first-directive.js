
import templateUrl from '../../templates/first.directive.tpl.html';

export default function( FirstService ) {
  'ngInject';
  return {
    restrict: 'E',
    templateUrl: templateUrl,
    link: function() {}
  };
};
