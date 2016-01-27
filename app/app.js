/**
 * @namespace FSCounterAggregatorApp
 */

(function(){

	// Defining a new app: FSCounterAggregator
	var app = angular.module('FSCounterAggregatorApp',['ngRoute','ui.bootstrap']);

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
	}]);
}());
