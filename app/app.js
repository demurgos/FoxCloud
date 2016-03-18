/**
 * @namespace FSCounterAggregatorApp
 */

(function() {

    var app = angular.module('FSCounterAggregatorApp',[
	'ngRoute',
	'ngResource',
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
			    templateUrl: 'build/html/SettingsSiteItemsView.html',
			    controller: 'SettingsSiteItems',
			    pageName : "Site cameras",
			    category : "Settings"
			}).
			when('/settings_users', {
			    templateUrl: 'build/html/SettingsUsersView.html',
			    controller: 'SettingsUsers',
			    pageName : "User management",
			    category : "Settings"
			}).
			when('/settings_sites', {
			    templateUrl: 'build/html/SettingsSitesView.html',
			    controller: 'SettingsSites',
			    pageName : "Site management",
			    category : "Settings"
			}).
			when('/settings_site_users', {
			    templateUrl: 'build/html/SettingsSiteUsersView.html',
			    controller: 'SettingsSiteUsers',
			    pageName : "Site users",
			    category : "Settings"
			}).
			otherwise({
			    redirectTo: '/dashboard'
			});
		}
	       ]);
}());
