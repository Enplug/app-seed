
import app from '../app';
import lodash from 'lodash';

export default class EditController {

    constructor ( $scope, $enplugDashboard, $location, DemoService, feed) {

        'ngInject';

        // Scope property that will be passed into demo directive 
        $scope.demoContent = {
            'title': 'Demo for Directive. Content will passed to directive scope'
        }
        // Dashboard header configuration
        $enplugDashboard.setHeaderTitle( feed.id == '' ? 'Setup' : 'Edit' );
        $enplugDashboard.setDisplaySelectorVisibility(false);

        function renderIndexTpl() {
            $location.path('/');
        }

        function setHeaderButtons() {
            $enplugDashboard.setHeaderButtons([
                { text: 'All Assets', action: renderIndexTpl, class: 'btn-primary'}
            ]);
        }

        setHeaderButtons();

    }
};

app.controller( 'EditController', EditController );
