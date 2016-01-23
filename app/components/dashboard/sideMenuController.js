/*
 * Menu used to select dashboards
 **/

(function() {

 angular.module('FSCounterAggregatorApp').controller('SideMenuController', ['$scope', function($scope) {
     
     // create a responsive menu tree 
     // this method must be called after the sidebar dom creation
     // for ng-include, we use onload directive
     // TODO: use the angular way instead of jQuery
     $scope.createTree = function() {
	 $.AdminLTE.tree('.sidebar');
     };

 }]);

}());
