/**
 * @class GraphKPI
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying a KPI value from a specific indicator
 **/
angular.module('FSCounterAggregatorApp').
    directive('fcaGraphKpi', function() {
	return {		
	    scope: {
		data: '=',
		kpi: '='
	    },
	    controller: [
		'$scope',
		'WidgetStyleService',
		function(
		    $scope,
		    WidgetStyleService
		) {

		    $scope.widgetId = "GraphSiteWidget";
		    
		    $scope.siteSelected = undefined; 

		    $scope.data.loadParams().then(function() {
			$scope.siteSelected = $scope.data.sites[0];
			$scope.update();
		    });

		    $scope.siteComparisonSelected = undefined;

		    $scope.style = undefined;
		    $scope.countingChartOptions = undefined;
		    $scope.countingChartData = undefined;

		    $scope.indicatorSelected = { id: $scope.kpi.options.defaultIndicatorId };

		    $scope.rangeSelected = { id: $scope.kpi.options.defaultRangeId };

		    $scope.periodTimeFormat = WidgetStyleService.getTimeFormat($scope.data.period,
									       $scope.rangeSelected.id);

		    $scope.total = 0;

		    $scope.toggleSiteComparison = function(open) {
			$scope.siteComparisonSelected = (open ? ($scope.data.sites[0].id !== $scope.siteSelected.id ? 
								 $scope.data.sites[0] : $scope.data.sites[1]) : undefined);
		    };

		    $scope.$watch('data.period', function(oldPeriod, newPeriod) {
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

			$scope.data.getSiteData($scope.siteSelected.id)
			    .then(function(data) {
				
				var res = $scope.kpi.
				    compute({ data: data,
					      period: $scope.data.period,
					      groupBy: $scope.rangeSelected.id,
					      indicator: $scope.indicatorSelected.id });
				$scope.total = res.value;
				$scope.periodTimeFormat = WidgetStyleService.getTimeFormat($scope.data.period,
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
				    return WidgetStyleService.getRangeTimeFormat($scope.rangeSelected.id)(d, $scope.data.period);
				};
				$scope.countingChartOptions = $scope.style.nvd3;
				$scope.countingChartData = [];			    
			    });		    
		    };    		    

		}],
	    link: function(scope, element, attr) {
		scope.createWidget();
	    },
	    templateUrl: 'build/html/GraphKPIView.html'
	};
    });
	    
