
import app from '../app';

export default class IndexController {
    // Inject Controller Dependencies Here:
    constructor ( $scope, $enplugDashboard, $location, $route, DemoService, feeds ) {

        // Default Dashboard Configuration
        $enplugDashboard.setHeaderTitle('');
        $enplugDashboard.pageLoading(false);
        $enplugDashboard.setDisplaySelectorCallback($route.reload);

        function renderEditTpl() {
            $location.path('/setup');
        }

        function setHeaderButtons() {
            $enplugDashboard.setHeaderButtons([
                { text: 'Add Content', action: renderEditTpl, class: 'btn-primary'}
            ]);
        }

        setHeaderButtons();


    }
};

app.controller( 'IndexController', IndexController );
