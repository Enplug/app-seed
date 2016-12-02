
import app from '../app';

export default class IndexController {
    // Inject Controller Dependencies Here:
    constructor ( $scope, $enplugDashboard, $location, $route, DemoService, feeds ) {

        // Scope Property for all feeds or assets
        $scope.feeds = feeds;

        // Default Dashboard Configuration
        $enplugDashboard.setHeaderTitle('');
        $enplugDashboard.pageLoading(false);
        $enplugDashboard.setDisplaySelectorCallback($route.reload);

        // Makes call to deploy & update an asset using Service
        $scope.deployFeed = function (feed) {
            DemoService.saveFeed(feed, true).then(function(){
                $route.reload();
            })
        };

        $scope.renderEdit = function(id) {
            if(id) {
                $location.path('/edit/' + id);
            } else {
                $location.path('/setup');
            }
        }

        function setHeaderButtons() {
            $enplugDashboard.setHeaderButtons([
                { text: 'Add Content', action: $scope.renderEdit, class: 'btn-primary'}
            ]);
        }

        setHeaderButtons();


    }
};

app.controller( 'IndexController', IndexController );
