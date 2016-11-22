
import app from '../app';

export default class AssetIndexController {
    // Inject Controller Dependencies Here:
    constructor ( $scope, $enplugDashboard, $location, $route, AssetService, feeds ) {

        /*****************************************
          Dashboard SDK - $enplugDashboard methods
        *****************************************/

        // Default Dashboard Configuration
        $enplugDashboard.setHeaderTitle('');
        $enplugDashboard.pageLoading(false);
        $enplugDashboard.setDisplaySelectorCallback($route.reload);

        function setHeaderButtons() {
            $enplugDashboard.setHeaderButtons([
                { text: 'Add Content', action: $scope.addFeed, class: 'btn-primary'}
            ]);
        }

        // Assigning scope property to Enplug feeds create for this app. Resolved in main.js through our AssetService and passed in as dependency
        $scope.feeds = feeds;

        // Changing routes using $location if adding new feeds, or editing one
        $scope.addFeed = function () {
            $location.path('/setup');
        };

        setHeaderButtons();

        $scope.editFeed = function (id) {
            $location.path('/edit/' + id);
        };

        // Makes call to deploy & update an feed using AssetService
        $scope.deployFeed = function (feed) {
            AssetService.saveFeed(feed, true).then(function(){
                $route.reload();
            })
        };

        // Uses AssetService to delete a feed
        $scope.deleteFeed = function(feed) {
            $enplugDashboard.openConfirm({
                title: 'Delete Feed',
                text: 'Are you sure you want to delete <strong>' + feed.title + '</strong> ?',
                cancelText: 'Cancel',
                confirmText: 'Delete',
                confirmClass: 'btn-danger'
            }).then(function () {
                AssetService.deleteById(feed.id ).then(function(){
                    $enplugDashboard.successIndicator('Deleted "' + feed.title +'"');
                    $route.reload();
                }, function () {
                    $enplugDashboard.errorIndicator( 'Could not delete your feed ');
                });
            })
        };
    }
};

app.controller( 'AssetIndexController', AssetIndexController );
