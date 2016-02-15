/**
 * @class StatBoxSum
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying a KPI value from a specific indicator
 **/
angular.module('FSCounterAggregatorApp').
    directive('fcaStatBoxSum', function() {
	return {		
	    scope: {
		indicator: '@?',
		label: '@?',
		data: '=',
		kpi: '@?',
		bgColor: '@?',
		icon: '@?'
	    },
	    controller: [
		'$scope',
		'WidgetStyleService', 
		'KPI',
		'DashboardParamsService',
		function(
		    $scope,
		    WidgetStyleService,
		    KPI,
		    DashboardParamsService
		) {
		    $scope.kpi = $scope.kpi !== undefined ? $scope.kpi : 'sum';
		    $scope.indicator = $scope.indicator !== undefined ? $scope.indicator : 
			WidgetStyleService.getDefaultIndicatorId();
		    $scope.label = $scope.label !== undefined ? $scope.label : 
			KPIRef.getLabel($scope.indicator);
		    $scope.value = 0;
		    $scope.widgetId = 'statbox/' + $scope.kpi + '/' + $scope.indicator;
		    $scope.data = $scope.data !== undefined ? $scope.data :
			DashboardParamsService;

		    $scope.KPIRef = KPI.getKPI($scope.kpi);

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
				var res = $scope.KPIRef.compute({ data: data,
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

