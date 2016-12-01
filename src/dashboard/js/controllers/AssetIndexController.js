
import app from '../app';

export default class AssetIndexController {
    // Inject Controller Dependencies Here:
    constructor ( $scope, $enplugDashboard, $enplugAccount, $location, $route, AssetService, feeds ) {

        // Assigning scope property to feeds. Resolved in main.js and passed in as dependency
        $scope.feeds = feeds;
        // Default Dashboard Configuration
        $enplugDashboard.setHeaderTitle('');
        $enplugDashboard.pageLoading(false);
        $enplugDashboard.setDisplaySelectorCallback($route.reload);

        // Redirecting to Setup/Edit Template when there are no Enplug Video Feeds
        if($scope.feeds.length === 0){
            $location.path('/setup');
        }
        // Changing routes using $location if adding new or editing feed
        $scope.addFeed = function () {
            $location.path('/setup');
        };

        $scope.editFeed = function (id) {
            $location.path('/edit/' + id);
        };

        // Makes call to deploy & update an asset using Service
        $scope.deployFeed = function (feed) {
            AssetService.saveFeed(feed, true).then(function(){
                $route.reload();
            })
        };
        // Makes API call to Delete an Asset
        $scope.deleteFeed = function(feed) {
            $enplugDashboard.openConfirm({
                title: 'Delete Video Feed',
                text: 'Are you sure you want to delete <strong>' + feed.title + '</strong> ?',
                cancelText: 'Cancel',
                confirmText: 'Delete',
                confirmClass: 'btn-danger'
            }).then(function () {
                AssetService.deleteById(feed.id ).then(function(){
                    $enplugDashboard.successIndicator('Deleted "' + feed.title +'"');
                    $route.reload();
                }, function () {
                    $enplugDashboard.errorIndicator( 'Could not delete video');
                });
            })
        };

        // Function Setting up Dashboard Header Buttons
        function setHeaderButtons() {
            $enplugDashboard.setHeaderButtons([
                { text: 'Add Video', action: $scope.addFeed, class: 'btn-primary'}
            ]);
        }

        setHeaderButtons();
    }
};

app.controller( 'AssetIndexController', AssetIndexController );
