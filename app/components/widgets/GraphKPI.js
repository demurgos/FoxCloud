/**
 * @class GraphKPI
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying a KPI value from a specific indicator
 **/
angular.module('FSCounterAggregatorApp').
    directive('fcaGraphKpi', function() {
	return {		
	    scope: {
		params: '=',
		kpi: '='
	    },
	    controller: [
		'$scope',
		'WidgetStyleService',
		function(
		    $scope,
		    WidgetStyleService
		) {

		    var $injector = angular.injector(['FSCounterAggregatorApp']);
		    var s = $injector.get('WidgetStyleService');

		    $scope.widgetId = "GraphKPIWidget";		    
		    $scope.sitesSelected = [ undefined, undefined ]; 

		    $scope.$watch("params.sites", function(oldSites, newSites) {
			if(oldSites !== newSites) {
			    $scope.sitesSelected[0] = $scope.params.sites[0];
			}
		    });

		    $scope.siteComparisonSelected = undefined;

		    $scope.style = undefined;
		    $scope.countingChartOptions = undefined;
		    $scope.countingChartData = undefined;

		    $scope.indicatorSelected = { id: $scope.kpi.options.defaultIndicatorId };

		    $scope.rangeSelected = { id: $scope.kpi.options.defaultRangeId };

		    $scope.rangesEnabled = {};
 		    for(var i = 0; i < $scope.kpi.options.ranges.length; ++i) {
			$scope.rangesEnabled[$scope.kpi.options.ranges[i].id] = true;
		    }

		    $scope.periodTimeFormat = $scope.kpi.getTimeFormat($scope.params.period,
								       $scope.rangeSelected.id);

		    $scope.total = [];

		    /**
		     * When true, set the default value for 2nd site
		     * force comparison to be at minimum by hours
		     * set interactive guideline
		     */
		    $scope.toggleSiteComparison = function(open) {
			$scope.sitesSelected[1] = (open ? ($scope.params.sites[0].id !== $scope.sitesSelected[0].id ? 
							   $scope.params.sites[0] : $scope.params.sites[1]) : undefined);
			$scope.countingChartOptions.chart.useInteractiveGuideline = open;
			$scope.updateSelectedRange();
			$scope.update();
		    };

		    $scope.$watch('params.data', function(oldData, newData) {
			if(newData !== oldData) {
			    $scope.updateSelectedRange();
			    $scope.update();
			}
		    });

		    $scope.$watch('rangeSelected.id', function(oldId, newId) {
			if(oldId !== newId) {
			    $scope.update();
			}
		    });

		    $scope.updateSelectedRange = function() {
			var firstEnabledRange;
			for(var i = 0; i < $scope.kpi.options.ranges.length; ++i) {
			    var rangeId = $scope.kpi.options.ranges[i].id;
			    var computable =
				$scope.kpi.isPeriodComputable($scope.params.period,
							      rangeId) &&
				($scope.kpi.isPeriodComparable(rangeId) || !$scope.sitesSelected[1]);
			    if(!firstEnabledRange &&
			       computable) {
				firstEnabledRange = rangeId;
			    }
			    $scope.rangesEnabled[rangeId] = computable;
			}			
			if(!$scope.rangesEnabled[$scope.rangeSelected.id]) {
			    $scope.rangeSelected.id = firstEnabledRange;
			}
		    };

		    $scope.getDataFromSelectedSites = function() {
			var data = [];
			for(var i = 0; i < $scope.sitesSelected.length; ++i) {
			    if($scope.sitesSelected[i] !== undefined) {
				var idx = _.findIndex($scope.params.data, { 
				    "id": $scope.sitesSelected[i].id });
				if(idx != -1) {
				    data.push($scope.params.data[idx]);
				}
			    }
			}
			return data;
		    };

		    $scope.getSiteName = function(id) {
			var idx = _.findIndex($scope.params.sites,
					      { "id": id });
			return idx != -1 ? $scope.params.sites[idx].name : undefined;
		    };

		    $scope.update = function() {

			$scope.total = [];
			var chartData = [];
			for(var i = 0; i < $scope.sitesSelected.length; ++i) {
			    if($scope.sitesSelected[i] !== undefined) {
				var idx = _.findIndex($scope.params.data, {
				    "id": $scope.sitesSelected[i].id });
				var res = $scope.kpi.compute({
				    data: $scope.params.data[idx].data,
				    period: $scope.params.period,
				    groupBy: $scope.rangeSelected.id,
				    indicator: $scope.indicatorSelected.id });
				chartData.push({
				    key: $scope.getSiteName($scope.sitesSelected[i].id) + 
					" - " + 
					$scope.kpi.getIndicatorName(res.query.indicator),
				    values: res.data,
				    area: true });
				$scope.total.push(res.total);
			    }
			}
			$scope.periodTimeFormat = $scope.kpi.getTimeFormat($scope.params.period,
									   $scope.rangeSelected.id);
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
				    return $scope.kpi.getRangeTimeFormat($scope.rangeSelected.id)(d, $scope.params.period);
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
	    
