/**
 * @class StatBoxKPI
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying a KPI value from a specific indicator
 **/
angular.module('FSCounterAggregatorApp').
    directive('fcaStatBoxKpi', function(){
	return {
	    scope: {
		indicator: '@',
		label: '@?',
        description: '@?',
        unit: '@?',
		params: '=',
		kpi: '=',
		bgColor: '@?',
		icon: '@?',
		displayFilters: '@?'
	    },
	    controller: [
		'$scope',
		'$filter',
		'WidgetStyleService',
		function(
		    $scope,
		    $filter,
		    WidgetStyleService
		) {
		    function applyFilters(value)
		    {
			if(!$scope.displayFilters)
			    return value;

			return $filter($scope.displayFilters)(value);
		    }

		    $scope.label = $scope.label !== undefined ? $scope.label :
			$scope.kpi.getLabel($scope.indicator);
		    $scope.value = 0;
		    $scope.valueCompared = 0;
		    $scope.widgetId = 'statbox/' + $scope.kpi + '/' + $scope.indicator;

		    $scope.periodComparisonSelected = false;
		    
		    WidgetStyleService.getStyle($scope.widgetId)
			.then(function(data) {
			});

		    $scope.$watch('params.data', function(oldData, newData) {
			if(newData !== oldData) {
			    $scope.update();
			}
		    });

		    $scope.$watch('params.comparedData', function(newData, oldData) {
			if(newData !== undefined && newData.length) {
			    $scope.periodComparisonSelected = true;
			    $scope.updateCompared();
			} else if($scope.periodComparisonSelected) {
			    $scope.periodComparisonSelected = false;
			}
		    });

		    function getValue(data, period, indicator) {
			var res = $scope.kpi.compute({ allsitedata : data,
						       period: period,
						       indicator: indicator,
						       omitTable: true });
			return applyFilters(res.value);
		    }
		    
		    $scope.update = function() {
			$scope.value = getValue($scope.params.data,
						$scope.params.period,
						$scope.indicator);
		    };

		    $scope.updateCompared = function() {
			if($scope.periodComparisonSelected) {
			    $scope.valueCompared = getValue($scope.params.comparedData,
							    $scope.params.comparedPeriod,
							    $scope.indicator);
			}
		    };
		    
		    
		}],
	    link: function(scope, element, attr) {
		scope.bgColor = scope.bgColor !== undefined ? scope.bgColor : 'bg-aqua';
		scope.icon = scope.icon !== undefined ? scope.icon : 'ion-ios-download';
	    },
	    templateUrl: 'build/html/StatBoxKPIView.html'
	};
    });
