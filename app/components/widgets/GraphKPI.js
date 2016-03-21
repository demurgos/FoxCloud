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

		    //var $injector = angular.injector(['FSCounterAggregatorApp']);
		    //var s = $injector.get('WidgetStyleService');

		    $scope.widgetId = "GraphKPIWidget";
		    $scope.sitesSelected = [ undefined, undefined ];
		    $scope.chartData = [ {}, {} ];
		    $scope.chartLegends = [];

		    $scope.$watch("params.sites", function(newSites, oldSites) {
			if(newSites !== undefined && newSites.length) {
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

		    /**
		     * When true, set the default value for 2nd site
		     * force comparison to be at minimum by hours
		     * set interactive guideline
		     */
		    $scope.toggleSiteComparison = function(open) {
			$scope.sitesSelected[1] = (open ? ($scope.params.sites[0].id !== $scope.sitesSelected[0].id ?
							   $scope.params.sites[0] : $scope.params.sites[1]) : undefined);
			//$scope.countingChartOptions.chart.useInteractiveGuideline = open;
			$scope.updateSelectedRange();
			$scope.update();
		    };

		    // todo: update site list regarding the sites
		    // delivered by the data provider
		    $scope.$watch('params.data', function(newData, oldData) {
			if(newData !== undefined && newData.length) {
			    //$scope.updateSiteList();
			    $scope.updateSelectedRange();
			    $scope.update();
			}
		    });

		    $scope.$watch('rangeSelected.id', function(newId, oldId) {
			if(oldId !== newId) {
			    $scope.update();
			}
		    });

//		    $scope.updateSiteList = function() {
//			if($scope.params.data !== undefined &&
//			   $scope.params.data.length &&
//			   $scope.sitesSelected[0] === undefined) {
//			    $scope.sitesSelected[0] = $scope.params.data[0].id;
//			}
//		    };

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

		    $scope.getSiteName = function(id) {
			var idx = _.findIndex($scope.params.sites,
					      { "id": id });
			return idx != -1 ? $scope.params.sites[idx].name : undefined;
		    };

		    $scope.update = function() {

			WidgetStyleService.getStyle($scope.widgetId).
			    then(function(style) {

				$scope.setWidgetStyle(style);

				var chartData = [];
				var chartLegends = [];
				for(var i = 0; i < $scope.sitesSelected.length; ++i) {
				    if($scope.sitesSelected[i] !== undefined) {
					var idx = _.findIndex($scope.params.data, {
					    "id": $scope.sitesSelected[i].id });
					var res = $scope.kpi.compute({
					    sitedata: $scope.params.data[idx].data,
					    period: $scope.params.period,
					    groupBy: $scope.rangeSelected.id,
					    indicator: $scope.indicatorSelected.id });
					var key = $scope.getSiteName($scope.sitesSelected[i].id) +
					    " - " +
					    $scope.kpi.getIndicatorName(res.query.indicator);
					$scope.chartData[i] = angular.extend({ key: key,
									       values: res.data },
									     $scope.style.chartData[i]);
					chartData.push($scope.chartData[i]);
					chartLegends.push({ label: key,
							    total: res.value,
							    color: $scope.chartData[i].color });
				    }
				}
				$scope.periodTimeFormat = $scope.kpi.getTimeFormat($scope.params.period,
										   $scope.rangeSelected.id);
				$scope.countingChartData = chartData;
				$scope.chartLegends = chartLegends;
			    });
		    };

		    $scope.setWidgetStyle = function(style) {
			$scope.style = style.json;
			$scope.style.nvd3.chart.xAxis.tickFormat = function(d) {
			    return moment(d).format($scope.periodTimeFormat);
			};
			$scope.style.nvd3.chart.yAxis.tickFormat = function(d) {
			    return d3.format('d')(d);
			};
			$scope.style.nvd3.chart.interactiveLayer.tooltip.headerFormatter = function(d, i) {
			    return $scope.kpi.getRangeTimeFormat($scope.rangeSelected.id)(d, $scope.params.period);
			};
			$scope.countingChartOptions = $scope.style.nvd3;

			$scope.countingChartOptions.chart.xScale = d3.time.scale();

			$scope.countingChartData = [];
		    };

		}],
	    link: function(scope, element, attr) {
	    },
	    templateUrl: 'build/html/GraphKPIView.html'
	};
    });
