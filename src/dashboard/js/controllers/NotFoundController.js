
import app from '../app';

export default class NotFoundController {

    constructor ( $scope, $location, $enplugDashboard, Info ) {

        'ngInject';
        
        $scope.message = Info.pageNotFound;

        $enplugDashboard.pageLoading(false);
        $enplugDashboard.setHeaderTitle('');
        $enplugDashboard.setDisplaySelectorVisibility(true);
        $enplugDashboard.setHeaderButtons([{
            text: 'App Home',
            action: function () {
                $location.path('/');
            },
            class: 'btn-default ion-home'
        }]);
    }

};

app.controller( 'NotFoundController', NotFoundController );
