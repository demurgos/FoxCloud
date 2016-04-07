/**
 * @class CalendarPicker
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation
 **/
angular.module('FSCounterAggregatorApp').
    directive('fcaCalendarPicker', function() {
	return {
	    scope: {
		params: '='
	    },
	    controller: [
		'$scope',
		function(
		    $scope
		) {

		    $scope.comparisonRequired = false;

		    $scope.localComparedPeriod = $scope.params.comparedPeriod;
		    
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
		  
		    $scope.singleDateOpts = {
			
			singleDatePicker:true,
			locale: {
			    format: 'MMM D,YYYY'
			}
		    };

		    $scope.$watch('comparisonRequired', function(newComp) {
			if(!newComp) {
			    $scope.params.disableDataCompared();
			} else {
			    $scope.params.loadDataCompared();
			}
		    });
		    
		    $scope.$watch('localComparedPeriod', function(newDate, oldData) {
			if($scope.localComparedPeriod !== undefined &&
			   $scope.localComparedPeriod.startDate === undefined &&
			   $scope.comparisonRequired) {
			    var duration =  moment.duration($scope.params.period.endDate.diff($scope.params.period.startDate));
			    $scope.params.comparedPeriod.startDate = $scope.localComparedPeriod;
			    $scope.params.comparedPeriod.endDate = moment($scope.params.comparedPeriod.startDate).add(duration);
			    $scope.params.loadDataCompared();
			}
		    });
		    
		    $scope.$watch('params.period', function(newPeriod, oldPeriod) {
			if(newPeriod !== oldPeriod) {
			    $scope.params.loadData();
			    var duration =  moment.duration($scope.params.period.endDate.diff($scope.params.period.startDate));
			    $scope.params.comparedPeriod.endDate =
				moment($scope.params.comparedPeriod.startDate).add(duration);
			    if($scope.comparisonRequired) {
				$scope.params.loadDataCompared();
			    }
			}
		    });		    
		}],
	    link: function(scope, element, attr) {
	    },
	    templateUrl: 'build/html/CalendarPickerView.html'
	};
    });
