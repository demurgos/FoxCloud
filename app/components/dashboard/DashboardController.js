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
 
	    $scope.periodOpts = {
		ranges: {
		    'Today': [moment(), moment()],
		    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
		    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
		    'This Month': [moment().startOf('month'), moment().endOf('month')],
		    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		},
		locale: {
		    format: 'MMM D,YYYY'
		}
	    };
	}]);

}());
