/*
 * Menu used to select dashboards
 **/

(function() {

 angular.module('FSCounterAggregatorApp')
	.directive('fcaSideMenu', [
	    'LayoutService',
	    function(LayoutService) {
	    return {
		link: function(scope, element, attr) {
		    LayoutService.init();
		},
		templateUrl: 'build/html/SideMenuView.html'
	    };
	}]);
}());
