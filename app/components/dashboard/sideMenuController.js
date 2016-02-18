/*
 * Menu used to select dashboards
 **/

(function() {

 angular.module('FSCounterAggregatorApp')
	.controller('SideMenuController', [
	    function() {
	    }])
	.directive('fcaSideMenu', [
	    'LayoutService',
	    function(LayoutService) {
	    return {
		link: function(scope, element, attr) {
		    LayoutService.init();
		},
		templateUrl: 'build/html/sideMenuView.html'
	    };
	}]);
}());
