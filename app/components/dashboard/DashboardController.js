/*
 * Manage the dashboard data
 **/

(function(){
    
    angular.module('FSCounterAggregatorApp').controller('DashboardController', [
	'$scope',
	'DashboardParamsService',	
	function(
	    $scope,
	    DashboardParamsService
	) {	   
	    $scope.params = DashboardParamsService;
	    
	    $scope.params.loadParams().then(function() {
		$scope.params.loadData();
	    });

	    /*
	    $scope.$watch('params.period', function(newPeriod, oldPeriod) {
		if(newPeriod !== oldPeriod) {
		    $scope.params.loadData();
		}
	    });
	    */

	    $scope.exportPrint = function() {
		window.print();
	    };

	}]);

}());
