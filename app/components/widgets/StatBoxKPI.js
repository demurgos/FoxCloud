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
		    $scope.widgetId = 'statbox/' + $scope.kpi + '/' + $scope.indicator;

		    WidgetStyleService.getStyle($scope.widgetId)
			.then(function(data) {
			});

		    $scope.$watch('params.data', function(oldData, newData) {
			if(newData !== oldData) {
			    $scope.update();
			}
		    });

		    $scope.update = function() {
			var res = $scope.kpi.compute({ allsitedata : $scope.params.data,
						       period: $scope.params.period,
						       indicator: $scope.indicator,
						       omitTable: true });
			$scope.value = applyFilters(res.value);
		    };
		}],
	    link: function(scope, element, attr) {
		scope.bgColor = scope.bgColor !== undefined ? scope.bgColor : 'bg-aqua';
		scope.icon = scope.icon !== undefined ? scope.icon : 'ion-ios-download';
	    },
	    template: '<fca-stat-box value="value" label="label" bg-color="bgColor" icon="icon"></fca-stat-box>'
	};
    });
