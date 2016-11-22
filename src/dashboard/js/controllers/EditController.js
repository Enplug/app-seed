
import app from '../app';
import lodash from 'lodash';

export default class EditController {

    constructor ( $scope, $location, $enplugDashboard, AssetService, feed) {

        'ngInject';

        // Assigning scope property feed to feed resolved in main.js by service. Also using loadsh to create a deep clone of feed used to compare changes in $watch method below
        $scope.feed = _.clone(feed, true);

        // Dashboard header configuration
        $enplugDashboard.setHeaderTitle( feed.id == '' ? 'Setup' : 'Edit' );
        $enplugDashboard.setDisplaySelectorVisibility(false);

        // Scope property initally set to false when controller is instatiated. Disables save button at top of dashboard unless user has entered valid data and made changes
        $scope.changesToSave = false;

        // Watch Method for Detecting Changes
        $scope.$watch('feed', function () {

            $scope.changesToSave = (
                feed.title != $scope.feed.title
                || feed.url != $scope.feed.url)

            if ($scope.changesToSave) {
                $scope.changesToSave = validateForm();
            }

            let buttons = [{text: 'Save', action: save, class: 'btn-primary', disabled: !$scope.changesToSave }]

            if( AssetService.getNumberOfFeeds() > 0 ) {
                buttons.unshift({text: 'Cancel', action: $scope.changesToSave? cancel : navigateToRoot, class: 'btn-default'});
            }

            $enplugDashboard.setHeaderButtons(buttons);

        }, true);

        // Uses AssetService to make API call to update or create Feed
        function save() {
            return AssetService.saveFeed($scope.feed, feed.id=='').then(function(){
                navigateToRoot();
            });
        }

        function validateForm() {
            return $scope.feed.title && $scope.feed.url
        }

        // Confirms with user if they want to abort their changes, then takes them back to root path
        function cancel() {
            $enplugDashboard.openConfirm({
                title: 'Cancel Changes',
                text: 'Are you sure you want to cancel the changes you\'ve made?',
                cancelText: 'Close',
                confirmText: 'Confirm',
                confirmClass: 'btn-danger'
            }).then(function(){
                navigateToRoot();
            })
        }

        // Method to return to root path
        function navigateToRoot () {
            $location.path('/');
        };

    }
};

app.controller( 'EditController', EditController );
