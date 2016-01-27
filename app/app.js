/**
 * @namespace FSCounterAggregatorApp
 */

(function() {

    var app = angular.module('FSCounterAggregatorApp',[
	'ngRoute',
	'ui.bootstrap',
	'daterangepicker',
	'adminLTE']);
    
    // Configure routes
    app.config(['$routeProvider',
		function($routeProvider) {
		    $routeProvider.
			when('/dashboard', {
			    templateUrl: 'build/html/dashboardView.html'
			}).
			otherwise({
			    redirectTo: '/dashboard'
			});
		}
	       ]);
}());
