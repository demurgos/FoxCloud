(function(){

	// Defining a new app: FSCounterAggregator
	var app = angular.module('FSCounterAggregatorApp',['ngRoute']);

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
