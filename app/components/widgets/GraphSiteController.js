/*
 * Widget implementation for displaying site data on a graph
 **/

(function() {

    angular.module('FSCounterAggregatorApp').
	controller('GraphSiteController', [ 
	    '$scope', 
	    'DataService',
	    'ComputeService',
	    'DashboardParamsService',
	    function(
		$scope, 
		DataService,
		ComputeService,
		DashboardParamsService
	    ) {
		$scope.params = DashboardParamsService;

		$scope.$watch('params.period', function(oldPeriod, newPeriod) {
		    if(newPeriod !== oldPeriod) {
			$scope.update();
		    }
		});

		var countingChart;
		var countingChartLine;

		var countingChartData = {
		    labels: [],
		    datasets: [
			{
			    label: "In",
			    fillColor: "rgba(151,187,205,0.2)",
			    strokeColor: "rgba(151,187,205,1)",
			    pointColor: "rgba(151,187,205,1)",
			    pointStrokeColor: "#fff",
			    pointHighlightFill: "#fff",
			    pointHighlightStroke: "rgba(151,187,205,1)",
			    data: []
			}
		    ]
		};
		    
		var countingChartOptions = {
		    //Boolean - If we should show the scale at all
		    showScale: true,
		    //Boolean - Whether grid lines are shown across the chart
		    scaleShowGridLines: false,
		    //String - Colour of the grid lines
		    scaleGridLineColor: "rgba(0,0,0,.05)",
		    //Number - Width of the grid lines
		    scaleGridLineWidth: 1,
		    //Boolean - Whether to show horizontal lines (except X axis)
		    scaleShowHorizontalLines: true,
		    //Boolean - Whether to show vertical lines (except Y axis)
		    scaleShowVerticalLines: true,
		    //Boolean - Whether the line is curved between points
		    bezierCurve: true,
		    //Number - Tension of the bezier curve between points
		    bezierCurveTension: 0.3,
		    //Boolean - Whether to show a dot for each point
		    pointDot: true,
		    //Number - Radius of each point dot in pixels
		    pointDotRadius: 4,
		    //Number - Pixel width of point dot stroke
		    pointDotStrokeWidth: 1,
		    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		    pointHitDetectionRadius: 20,
		    //Boolean - Whether to show a stroke for datasets
		    datasetStroke: true,
		    //Number - Pixel width of dataset stroke
		    datasetStrokeWidth: 2,
		    //Boolean - Whether to fill the dataset with a color
		    datasetFill: true,
		    //String - A legend template
		    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%=datasets[i].label%></li><%}%></ul>",
		    //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
		    maintainAspectRatio: true,
		    //Boolean - whether to make the chart responsive to window resizing
		    responsive: true
		};

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
		    
		    DataService.getRawDataForCameraInInterval(0, $scope.params.period).
			then(function(data) {

			    var tdata = ComputeService.cSumForPeriod(data, 
								     $scope.params.period, 
								     $scope.rangeSelected, 
								     $scope.indicatorSelect.selected.id);

			    if(countingChartLine !== undefined) {
				countingChartLine.destroy();
			    }

			    countingChartData.labels = ComputeService.createTimeIndex($scope.params.period,
										      ComputeService.getTimeIterator($scope.rangeSelected),
										      function(i) { return i; });				      
			    countingChartData.datasets[0].data = tdata;
			    countingChartLine = countingChart.Line(countingChartData, countingChartOptions);
			});		  

		};

		
		$scope.createWidget = function() {
		    
		    // Counting chart
		    var countingChartCanvas = $("#counting-chart").get(0).getContext("2d");
		    countingChart = new Chart(countingChartCanvas);
		    $scope.update();
		    
		    //Sparkline charts
		    var sparklineLabels = ["January", "February", "March", "April", "May", "June", "July",
					   "August", "September", "October", "November", "December"];
		    var sparklineOptions = {
			showScale: false,
			scaleShowGridLines: false,
			scaleShowHorizontalLines: false,
			scaleShowVerticalLines: false,
			bezierCurve: true,
			bezierCurveTension: 0.3,
			pointDot: false,
			datasetStroke: true,
			datasetStrokeWidth: 2,
			datasetFill: true,
			maintainAspectRatio: true,
			showTooltips: false,
			responsive: true
		    };

		    var sparklineValues = [1000, 1200, 920, 927, 931, 1027, 819, 930, 1021, 980, 970, 1000];
		    var sparklineCanvas = $("#sparkline-1").get(0).getContext("2d");
		    var sparkline = new Chart(sparklineCanvas);
		    var sparklineData = {
			labels: sparklineLabels,
			datasets: [
			    {
				label: "In",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: sparklineValues
			    }
			]
		    };
		    sparkline.Line(sparklineData, sparklineOptions);

		    sparklineValues = [515, 519, 520, 522, 652, 810, 370, 627, 319, 630, 921, 900];
		    sparklineCanvas = $("#sparkline-2").get(0).getContext("2d");
		    sparkline = new Chart(sparklineCanvas);
		    sparklineData = {
			labels: sparklineLabels,
			datasets: [
			    {
				label: "In",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: sparklineValues
			    }
			]
		    };
		    sparkline.Line(sparklineData, sparklineOptions);

		    sparklineValues = [400, 423, 478, 410, 412, 510, 576, 580, 600, 605, 610, 607];
		    sparklineCanvas = $("#sparkline-3").get(0).getContext("2d");
		    sparkline = new Chart(sparklineCanvas);
		    sparklineData = {
			labels: sparklineLabels,
			datasets: [
			    {
				label: "In",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(151,187,205,1)",
				pointColor: "rgba(151,187,205,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: sparklineValues
			    }
			]
		    };
		    sparkline.Line(sparklineData, sparklineOptions);
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
