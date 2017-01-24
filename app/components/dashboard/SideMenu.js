/**
 * @class fcaSideMenu
 * @memberOf FSCounterAggregatorApp
 * @description Menu used to select dashboards
 */
(function() {

    require('../services/UserService');
    
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
			scope.hasAdminSites = false;
			
			LayoutService.init();

			function updateRights(data) {
			    var currentUserSites = data.sites;
			    scope.hasAdminSites = false;
			    for(var i = 0; i < currentUserSites.length; ++i) {
				if(currentUserSites[i].isadmin) {
				    scope.hasAdminSites = true;
				    break;
				}
			    }				
			}
			
			UserService.getSettings()
			    .then(function(ret) {
				scope.user = ret.user;
				updateRights(ret);
			    });

			scope.$watch('UserService.currentUserData', function (newVal) {
			    if(newVal) {
				scope.user = newVal.user;
				updateRights(newVal);
			    }
			});			
		    },
		    templateUrl: 'build/html/SideMenuView.html'
		};
	    }]);
}());
