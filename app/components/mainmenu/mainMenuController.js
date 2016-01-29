/*
 * Menu used to navigate through main settings
 **/

(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('MainMenuController', ['$scope', 'LayoutService', function($scope, LayoutService) {

	    // create a responsive control menu 
	    // this method must be called after the control-sidebar dom creation
	    // for ng-include, we use onload directive
	    // TODO: use the angular way instead of jQuery
	    $scope.createControl = function() {
		LayoutService.init();
	    };

	}])
	.directive('fcaMainMenu', function() {
	    return {
		link: function(scope, element, attr) {
		    scope.createControl();
		},
		templateUrl: 'build/html/mainMenuView.html'
	    };
	});
}());
