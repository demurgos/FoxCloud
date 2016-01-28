/*
 * Manage the dashboard data
 **/

(function(){
    
    angular.module('FSCounterAggregatorApp').controller('DashboardController', [
	'$scope',
	'DashboardParamsService',
	function(
	    $scope,
	    DashboardParamsService
	) {	   
	    $scope.params = DashboardParamsService;
 
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

	    $scope.periodOpts = {
		ranges: {
		    'Today': [moment(), moment()],
		    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
		    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
		    'This Month': [moment().startOf('month'), moment().endOf('month')],
		    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		},
		locale: {
		    format: 'MMM D,YYYY'
		}
	    };

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

	    //The Calender
	    $("#calendar").datepicker();

	    //SLIMSCROLL FOR CHAT WIDGET
	    $('#chat-box').slimScroll({
		height: '250px'
	    });

	    $("#example1").DataTable();

	}]);

}());
