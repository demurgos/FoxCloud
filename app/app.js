/**
 * @namespace FSCounterAggregatorApp
 */

(function() {

    var app = angular.module('FSCounterAggregatorApp',[
	'ngRoute',
	'ui.bootstrap',
	'daterangepicker',
	'nvd3',
	'adminLTE']);
    
    // Configure routes
    app.config(['$routeProvider',
		function($routeProvider) {
		    $routeProvider.
			when('/dashboard', {
			    templateUrl: 'build/html/DashboardView.html'
			}).
			otherwise({
			    redirectTo: '/dashboard'
			});
		}
	       ]);
}());
