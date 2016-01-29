/*
 * Manage the topbar data
 **/

(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('TopBarController', [function() {
	}])
	.directive('fcaTopBar', function() {
	    return {
		templateUrl: 'build/html/topBarView.html'
	    };
	});
    
}());
