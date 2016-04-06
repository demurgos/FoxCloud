/**
 * @class fcaSideMenu
 * @memberOf FSCounterAggregatorApp
 * @description Menu used to select dashboards
 */
(function() {
    
    angular.module('FSCounterAggregatorApp')
	.directive('fcaSideMenu', [
	    'LayoutService',
	    'UserService',
	    function(
		LayoutService,
		UserService
	    ) {
		return {
		    link: function(scope, element, attr) {
			
			scope.user = {};
			
			LayoutService.init();

			UserService.getSettings().then(function(data) {
			    scope.user = data.user;
			});
		    },
		    templateUrl: 'build/html/SideMenuView.html'
		};
	    }]);
}());
