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

		    $scope.widgetId = "GraphKPIWidget";		    
		    $scope.sitesSelected = [ undefined, undefined ]; 

		    $scope.$watch("data.sites", function(oldSites, newSites) {
			if(oldSites !== newSites) {
			    $scope.sitesSelected[0] = $scope.data.sites[0];
			    $scope.update();
			}
		    });

		    $scope.siteComparisonSelected = undefined;

		    $scope.style = undefined;
		    $scope.countingChartOptions = undefined;
		    $scope.countingChartData = undefined;

		    $scope.indicatorSelected = { id: $scope.kpi.options.defaultIndicatorId };

		    $scope.rangeSelected = { id: $scope.kpi.options.defaultRangeId };

		    $scope.periodTimeFormat = $scope.kpi.getTimeFormat($scope.data.period,
								       $scope.rangeSelected.id);

		    $scope.total = [];

		    /**
		     * When true, set the default value for 2nd site
		     */
		    $scope.toggleSiteComparison = function(open) {
			$scope.sitesSelected[1] = (open ? ($scope.data.sites[0].id !== $scope.sitesSelected[0].id ? 
							   $scope.data.sites[0] : $scope.data.sites[1]) : undefined);
			$scope.update();
		    };

		    $scope.$watch('data.data', function(oldData, newData) {
			if(newData !== oldData) {
			    $scope.update();
			}
		    });

		    $scope.$watch('rangeSelected.id', function(oldId, newId) {
			if(oldId !== newId) {
			    $scope.update();
			}
		    });

		    $scope.getDataFromSelectedSites = function() {
			var data = [];
			for(var i = 0; i < $scope.sitesSelected.length; ++i) {
			    if($scope.sitesSelected[i] !== undefined) {
				var idx = _.findIndex($scope.data.data, { 
				    "id": $scope.sitesSelected[i].id });
				if(idx != -1) {
				    data.push($scope.data.data[idx].data);
				}
			    }
			}
			return data;
		    };

		    $scope.update = function() {

			var res = $scope.kpi.compute({ data: $scope.getDataFromSelectedSites(),
						       period: $scope.data.period,
						       groupBy: $scope.rangeSelected.id,
						       indicator: $scope.indicatorSelected.id });
			$scope.total = res.value;
			$scope.periodTimeFormat = $scope.kpi.getTimeFormat($scope.data.period,
									   $scope.rangeSelected.id);
			
			var chartData = [];
			for(var i = 0; i < res.data.length; ++i) {
			    chartData.push({ 
				key: $scope.kpi.getIndicatorName($scope.indicatorSelected.id),
				values: res.data[i],
				area: true });			   
			} 
			
			$scope.countingChartData = chartData;
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
				    return $scope.kpi.getRangeTimeFormat($scope.rangeSelected.id)(d, $scope.data.period);
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
	    
