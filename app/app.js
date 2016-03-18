/**
 * @namespace FSCounterAggregatorApp
 */

(function() {

    var app = angular.module('FSCounterAggregatorApp',[
	'ngRoute',
	'ui.bootstrap',
	'daterangepicker',
	'nvd3',
	'datatables',
	'adminLTE']);
    
    // Configure routes
    app.config(['$routeProvider',
		function($routeProvider) {
		    $routeProvider.
			when('/dashboard', {
			    templateUrl: 'build/html/DashboardView.html',
			    controller: 'DashboardController',
			    pageName: 'Counters / Sites Overview',
			    category: 'Counters'
			}).
			when('/current_user', {
			    templateUrl: 'build/html/CurrentUserView.html',
			    pageName : "My account",
			    controller: 'CurrentUser',
			    category : "Settings"
			}).
			when('/settings_site_items', {
			    templateUrl: 'build/html/SettingsSiteItems.html',
			    pageName : "Site cameras",
			    category : "Settings"
			}).
			when('/settings_users', {
			    templateUrl: 'build/html/SettingsUsers.html',
			    pageName : "User management",
			    category : "Settings"
			}).
			when('/settings_sites', {
			    templateUrl: 'build/html/SettingsSites.html',
			    pageName : "Site management",
			    category : "Settings"
			}).
			when('/settings_site_users', {
			    templateUrl: 'build/html/SettingsSiteUsers.html',
			    pageName : "Site users",
			    category : "Settings"
			}).
			otherwise({
			    redirectTo: '/dashboard'
			});
		}
	       ]);
}());
