/**
 * @class Occupancy
 * @memberOf FSCounterAggregatorApp
 * @description Compute occupancy from a set of in/out values
 */
(function() {

    angular.module('FSCounterAggregatorApp').
	service('OccupancyIndicator', [
	    "ComputeService",
	    function(
		ComputeService
	    ) {

	    this.compute = function(data) {

		for(var i = 0; i < data.length; ++i) {
		    ComputeService.cOccupancy(data[i].data,
					      'in', 'out', 'occ');
		}
	    };
	}]);
})();
