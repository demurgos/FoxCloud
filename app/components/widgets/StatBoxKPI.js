/**
 * @class StatBoxKPI
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying a KPI value from a specific indicator
 **/
angular.module('FSCounterAggregatorApp').
    directive('fcaStatBoxKpi', function() {
	return {		
	    scope: {
		indicator: '@?',
		label: '@?',
		data: '=',
		kpi: '=',
		bgColor: '@?',
		icon: '@?'
	    },
	    controller: [
		'$scope',
		'WidgetStyleService',
		function(
		    $scope,
		    WidgetStyleService
		) {
		    $scope.indicator = $scope.indicator !== undefined ? $scope.indicator : 
			WidgetStyleService.getDefaultIndicatorId();
		    $scope.label = $scope.label !== undefined ? $scope.label : 
			$scope.kpi.getLabel($scope.indicator);
		    $scope.value = 0;
		    $scope.widgetId = 'statbox/' + $scope.kpi + '/' + $scope.indicator;

		    WidgetStyleService.getStyle($scope.widgetId)
			.then(function(data) {
			});	    		    

		    $scope.$watch('data.period', function(oldPeriod, newPeriod) {
			if(newPeriod !== oldPeriod) {
			    $scope.update();
			}
		    });
		    
		    $scope.update = function() {
			
			$scope.data.getSiteData(null)
			    .then(function(data) {
				var res = $scope.kpi.compute({ data: data,
							       period: $scope.data.period,
							       indicator: $scope.indicator });
				$scope.value = res.value;
			    });
		    };		    
		}],
	    link: function(scope, element, attr) {
		scope.bgColor = scope.bgColor !== undefined ? scope.bgColor : 'bg-aqua';
		scope.icon = scope.icon !== undefined ? scope.icon : 'ion-ios-download';
	    },
	    template: '<fca-stat-box value="value" label="label" bg-color="bgColor" icon="icon"></fca-stat-box>'
	};
    });

