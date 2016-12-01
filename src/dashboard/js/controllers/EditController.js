
import app from '../app';
import lodash from 'lodash';

export default class EditController {

    constructor ( $scope, $location, $enplugDashboard, AssetService, feed) {

        'ngInject';

        // Assigning scope property feed to a deep clone of the feed variable resolved by AssetService in main.js.
        $scope.feed = _.clone(feed, true);

        // Dashboard Header Configuration
        $enplugDashboard.setHeaderTitle( feed.id == '' ? 'Setup' : 'Edit' );
        $enplugDashboard.setDisplaySelectorVisibility(false);

        // Uses AssetService to make API call to update or create Feed
        function save() {
            return AssetService.saveFeed($scope.feed, feed.id=='').then(function(){
                navigateToRoot();
            });
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

        // Validating Fields for Title and Category Selected. The Save button is disabled until it returns true (there is at least a title and url enter)
        function validateForm() {
            var isValid = ($scope.feed.title
                 && $scope.feed.url)

            return isValid;
        }

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

    }
};

app.controller( 'EditController', EditController );
