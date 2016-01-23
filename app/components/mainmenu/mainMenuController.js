/*
 * Menu used to navigate through main settings
 **/

(function() {

 angular.module('FSCounterAggregatorApp').controller('MainMenuController', ['$scope', function($scope) {
     
     // create a responsive control menu 
     // this method must be called after the control-sidebar dom creation
     // for ng-include, we use onload directive
     // TODO: use the angular way instead of jQuery
     $scope.createControl = function() {
	 $.AdminLTE.controlSidebar.activate();
     };


 }]);

}());
