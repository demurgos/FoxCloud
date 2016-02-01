/*
 * Widget implementation for displaying site data on a graph
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

		$scope.style = undefined;
		$scope.countingChartOptions = undefined;
		$scope.countingChartData = undefined;
		$scope.sparklines = [];

		$scope.total = 0;

		$scope.$watch('params.period', function(oldPeriod, newPeriod) {
		    if(newPeriod !== oldPeriod) {
			$scope.update();
		    }
		});

		$scope.countingChart = undefined;
		var countingChartLine;

		$scope.indicatorSelect = {
		    selected: { id: 'in', name: 'In' },
		    options: [ { id: 'in', name: 'In' },
			       { id: 'out', name: 'Out' } ]
		};

		$scope.rangeOptions = [ { id: '15min', name: 'Minutes' },
					{ id: 'hours', name: 'Hourly' },
					{ id: 'days', name: 'Day' },
					{ id: 'week', name: 'Week' },
					{ id: 'month', name: 'Month' } ];

		$scope.rangeSelected = 'hours';

		$scope.setRange = function(r) {
		    $scope.rangeSelected = r;
		    $scope.update();
		};

		$scope.update = function() {

		    KPI.getSiteCountingPeriod({ id: 0,
						period: $scope.params.period,
						groupBy: $scope.rangeSelected,
						indicator: $scope.indicatorSelect.selected.id })
		    .then(function(res) {

			    if(countingChartLine !== undefined) {
				countingChartLine.destroy();
			    }

			$scope.countingChartData.labels = res.labels;
			    $scope.countingChartData.datasets[0].data = res.data;
			countingChartLine = $scope.countingChart.Line($scope.countingChartData, 
								      $scope.countingChartOptions);
		    });
		};
		
		$scope.createWidget = function() {
		    
		    WidgetStyleService.getStyle($scope.widgetId).
			then(function(data) {
			    $scope.style = data.json;
			    $scope.countingChartOptions = $scope.style.graph.options;
			    $scope.countingChartData = {
				datasets: [ $scope.style.graph.datasets["in"] ] };
			    $scope.update();

			    //Sparkline charts
			    var sparklineLabels = ["January", "February", "March", "April", "May", "June", "July",
						   "August", "September", "October", "November", "December"];
			    var sparklineOptions = $scope.style.sparkline.options;

			    var sparkline = $scope.sparklines[0];
			    var sparklineData = {
				labels: sparklineLabels,
				datasets: [ angular.extend({}, $scope.style.sparkline.datasets["in"]) ] };
			    sparklineData.datasets[0].data = [1000, 1200, 920, 927, 931, 1027, 819, 930, 1021, 980, 970, 1000];
			    sparkline.Line(sparklineData, sparklineOptions);

			    sparkline = $scope.sparklines[1];
			    sparklineData = {
				labels: sparklineLabels,
				datasets: [ angular.extend({}, $scope.style.sparkline.datasets["in"]) ] };
			    sparklineData.datasets[0].data = [515, 519, 520, 522, 652, 810, 370, 627, 319, 630, 921, 900];
			    sparkline.Line(sparklineData, sparklineOptions);

			    sparkline = $scope.sparklines[2];
			    sparklineData = {
				labels: sparklineLabels,
				datasets: [ angular.extend({}, $scope.style.sparkline.datasets["in"]) ] };
			    sparklineData.datasets[0].data = [400, 423, 478, 410, 412, 510, 576, 580, 600, 605, 610, 607];
			    sparkline.Line(sparklineData, sparklineOptions);
			});		    
		};    
	    }])
    .directive('fcaGraphSite', function() {
	return {
	    link: function(scope, element, attr) {

		// Counting chart
		var countingChartCanvas = $(element).find("#counting-chart").get(0).getContext("2d");

		scope.countingChart = new Chart(countingChartCanvas);

		scope.sparklines.push(new Chart($(element).find("#sparkline-1").get(0).getContext("2d")));
		scope.sparklines.push(new Chart($(element).find("#sparkline-2").get(0).getContext("2d")));
		scope.sparklines.push(new Chart($(element).find("#sparkline-3").get(0).getContext("2d")));

		scope.createWidget();
	    },
	    templateUrl: 'build/html/GraphSiteView.html'
	};
    });

}());
