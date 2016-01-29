/*
 * Menu used to select dashboards
 **/

(function() {

 angular.module('FSCounterAggregatorApp')
	.controller('SideMenuController', [function() {
	}])
	.directive('fcaSideMenu', function() {
	    return {
		templateUrl: 'build/html/sideMenuView.html'
	    };
	});
}());
