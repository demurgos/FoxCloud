/**
 * @namespace FSCounterAggregatorApp
 */

(function() {

  // Defining a new app: FSCounterAggregator
  // adminLTE module encapsulates LayoutService responsible of the setting up 
  // of menu animations parameters. See LayoutService.js for more details
  var app = angular.module('FSCounterAggregatorApp', ['ngRoute','adminLTE']);

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