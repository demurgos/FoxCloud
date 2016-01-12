/*
 * Manage the dashboard data
 **/

(function(){
    
    angular.module('FSCounterAggregatorApp').controller('DashboardController', [function(){
	
	//Make the dashboard widgets sortable Using jquery UI
	$(".connectedSortable").sortable({
	    placeholder: "sort-highlight",
	    connectWith: ".connectedSortable",
	    handle: ".box-header, .nav-tabs",
	    forcePlaceholderSize: true,
	    zIndex: 999999
	});
	$(".connectedSortable .box-header, .connectedSortable .nav-tabs-custom").css("cursor", "move");

	//bootstrap WYSIHTML5 - text editor
	$(".textarea").wysihtml5();

	$('.daterange').daterangepicker({
	    ranges: {
		'Today': [moment(), moment()],
		'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		'Last 7 Days': [moment().subtract(6, 'days'), moment()],
		'Last 30 Days': [moment().subtract(29, 'days'), moment()],
		'This Month': [moment().startOf('month'), moment().endOf('month')],
		'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
	    },
	    startDate: moment().subtract(29, 'days'),
	    endDate: moment()
	}, function (start, end) {
	});

	/* jQueryKnob */
	$(".knob").knob();

	//World map by jvectormap
	$('#world-map').vectorMap({
	    map: 'us_mill',
	    backgroundColor: "transparent",
	    regionStyle: {
		initial: {
		    fill: '#e4e4e4',
		    "fill-opacity": 1,
		    stroke: 'none',
		    "stroke-width": 0,
		    "stroke-opacity": 1
		}
	    },
	    series: {
		regions: [{
		    scale: ["#92c1dc", "#ebf4f9"],
		    normalizeFunction: 'polynomial'
		}]
	    }, 
	    markers: [
		{latLng: [25.764257, -80.204416], name: 'Foxstream Miami (In 32)'},
		{latLng: [37.748330, -122.443437], name: 'San Francisco Airport (In 3019)'},
		{latLng: [33.437340, -112.007252], name: 'Phoenix Airport (In 1458)'}
	    ]
	});

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

	//The Calender
	$("#calendar").datepicker();

	//SLIMSCROLL FOR CHAT WIDGET
	$('#chat-box').slimScroll({
	    height: '250px'
	});

	// Counting chart
	var countingChartCanvas = $("#counting-chart").get(0).getContext("2d");
	var countingChart = new Chart(countingChartCanvas);
	var countingChartData = {
	    labels: ["January", "February", "March", "April", "May", "June", "July",
		     "August", "September", "October", "November", "December"],
	    datasets: [
		{
		    label: "In",
		    fillColor: "rgba(151,187,205,0.2)",
		    strokeColor: "rgba(151,187,205,1)",
		    pointColor: "rgba(151,187,205,1)",
		    pointStrokeColor: "#fff",
		    pointHighlightFill: "#fff",
		    pointHighlightStroke: "rgba(151,187,205,1)",
		    data: [ 96, 80, 75, 56, 50, 43, 89, 76, 58, 66, 76, 52 ]
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

	countingChart.Line(countingChartData, countingChartOptions);

	$("#example1").DataTable();

    }]);

}());
