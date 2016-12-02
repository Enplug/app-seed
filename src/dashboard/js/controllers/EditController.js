
import app from '../app';
import lodash from 'lodash';

export default class EditController {

    constructor ( $scope, $enplugDashboard, $location, DemoService, feed) {

        'ngInject';

        // Scope property feed
        $scope.feed = feed;

        // Scope property that will be passed into demo directive
        $scope.demoContent = {
            'title': 'Demo for Directive. Content will passed to directive scope'
        }

        // Dashboard header configuration
        $enplugDashboard.setHeaderTitle( feed.id == '' ? 'Setup' : 'Edit' );
        $enplugDashboard.setDisplaySelectorVisibility(false);


        function saveAsset() {
            DemoService.saveFeed($scope.feed, feed.id=='').then(function(){
                renderIndex();
            }, function(error) {
                console.log('Save was aborted');
            });
        }

        function renderIndex() {
            $location.path('/');
        }

        function setHeaderButtons() {
            $enplugDashboard.setHeaderButtons([
                { text: 'All Assets', action: renderIndex, class: 'btn-primary'},
                {text: 'Save', action: saveAsset, class: 'btn-primary'}
            ]);
        }

        setHeaderButtons();

    }
};

app.controller( 'EditController', EditController );
