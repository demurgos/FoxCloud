/**
 * @class GraphSiteController
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying site data on a graph
 **/
(function() {

    angular.module('FSCounterAggregatorApp').
	controller('GraphSiteController', [ 
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
		$scope.widgetId = "GraphSiteWidget";

		$scope.params = DashboardParamsService;

		$scope.siteSelected = undefined; 

		DashboardParamsService.loadParams().then(function() {
		    $scope.siteSelected = $scope.params.sites[0];
		    $scope.update();
		});

		$scope.siteComparisonSelected = undefined;

		$scope.style = undefined;
		$scope.countingChartOptions = undefined;
		$scope.countingChartData = undefined;

		$scope.KPIRef = KPI.getKPI("sites-period");

		$scope.indicatorSelected = { id: WidgetStyleService.getDefaultIndicatorId() };

		$scope.rangeSelected = { id: WidgetStyleService.getDefaultRangeId() };

		$scope.periodTimeFormat = WidgetStyleService.getTimeFormat($scope.params.period,
									   $scope.rangeSelected.id);

		$scope.total = 0;

		$scope.toggleSiteComparison = function(open) {
		    $scope.siteComparisonSelected = (open ? ($scope.params.sites[0].id !== $scope.siteSelected.id ? 
							     $scope.params.sites[0] : $scope.params.sites[1]) : undefined);
		};

		$scope.$watch('params.period', function(oldPeriod, newPeriod) {
		    if(newPeriod !== oldPeriod) {
			$scope.update();
		    }
		});

		$scope.$watch('rangeSelected.id', function(oldId, newId) {
		    if(oldId !== newId) {
			$scope.update();
		    }
		});

		$scope.update = function() {

		    DashboardParamsService.getSiteData($scope.siteSelected.id)
			.then(function(data) {
			    
			    var res = $scope.KPIRef.
				compute({ data: data,
					  period: $scope.params.period,
					  groupBy: $scope.rangeSelected.id,
					  indicator: $scope.indicatorSelected.id });
			    $scope.total = res.value;
			    $scope.periodTimeFormat = WidgetStyleService.getTimeFormat($scope.params.period,
										       $scope.rangeSelected.id);
			    $scope.countingChartData = [
				{ key: WidgetStyleService.getIndicatorName($scope.indicatorSelected.id),
				  values: res.data,
				  area: true } ];
			});
		};
		
		$scope.createWidget = function() {
		    
		    WidgetStyleService.getStyle($scope.widgetId).
			then(function(data) {
			    $scope.style = data.json;
			    $scope.style.nvd3.chart.xAxis.tickFormat = function(d) {
				return moment(d).format($scope.periodTimeFormat);
			    };
			    $scope.style.nvd3.chart.yAxis.tickFormat = function(d) {
				return d3.format('d')(d);
			    };
			    $scope.style.nvd3.chart.tooltip.headerFormatter = function(d, i) {
				return WidgetStyleService.getRangeTimeFormat($scope.rangeSelected.id)(d, $scope.params.period);
			    };
			    $scope.countingChartOptions = $scope.style.nvd3;
			    $scope.countingChartData = [];			    
			});		    
		};    
	    }])
    .directive('fcaGraphSite', function() {
	return {
	    link: function(scope, element, attr) {
		scope.createWidget();
	    },
	    templateUrl: 'build/html/GraphSiteView.html'
	};
    });

}());
