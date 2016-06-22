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
	'datatables.bootstrap',
	'ui.codemirror',
	'adminLTE',
	'ngReallyClickModule'
    ]);

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
                when('/monitoring', {
                    templateUrl: 'build/html/MonitoringView.html',
                    controller: 'MonitoringController',
                    pageName: 'Monitoring / Sites Overview',
                    category: 'Monitoring'
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
		when('/settings_site_members/:siteId?', {
                    templateUrl: 'build/html/SettingsSiteMembersView.html',
                    controller: 'SettingsSiteMembers',
                    pageName : "Site Members",
                    category : "Settings"
                }).
                when('/settings_users', {
                    templateUrl: 'build/html/SettingsUsersView.html',
                    controller: 'SettingsUsers',
                    pageName : "Users management",
                    category : "Settings"
                }).
		when('/settings_sites', {
                    templateUrl: 'build/html/SettingsSitesView.html',
                    controller: 'SettingsSites',
                    pageName : "Sites - Users management",
                    category : "Settings"
                }).
                when('/settings_per_site/:siteId?', {
                    templateUrl: 'build/html/SettingsPerSiteView.html',
                    controller: 'SettingsPerSite',
                    pageName : "Per Site management",
                    category : "Settings"
                }).
		when('/settings_users_sites', {
                    templateUrl: 'build/html/SettingsUsersSitesView.html',
                    controller: 'SettingsUsersSites',
                    pageName : "Users - Sites management",
                    category : "Settings"
                }).
                when('/settings_per_user/:userId?', {
                    templateUrl: 'build/html/SettingsPerUserView.html',
                    controller: 'SettingsPerUser',
                    pageName : "Per User management",
                    category : "Settings"
                }).
                otherwise({
                    redirectTo: '/dashboard'
                });
        }
    ]);
}());
