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
			    var currentUserSites = data.sites;
			    scope.hasAdminSites = false;
			    for(var i = 0; i < currentUserSites.length; ++i) {
				if(currentUserSites[i].isadmin) {
				    scope.hasAdminSites = true;
				    break;
				}
			    }
			});
		    },
		    templateUrl: 'build/html/SideMenuView.html'
		};
	    }]);
}());
