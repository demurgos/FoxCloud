/**
 * @class TableKPI
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying statistics in a tabular format
 **/
angular.module('FSCounterAggregatorApp').
    directive('fcaTableKpi', function() {
	return {
	    templateUrl: 'build/html/TableKPIView.html'
	};
    });
