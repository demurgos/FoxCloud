/*
 * Manage the topbar data
 **/

(function() {

    angular.module('FSCounterAggregatorApp')
	.directive('fcaTopBar', 
		   ['UserService',
		    function(
			UserService
		    ) {
			return {
			    link: function(scope, element, attr) {
				scope.user = {};

				UserService.getSettings().then(function(data) {
				    scope.user = data.user;
				});
			    },
			    templateUrl: 'build/html/TopBarView.html'
			};
	}]);
    
}());
