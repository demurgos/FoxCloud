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

		var prevDate = "";

		function ResetOccupancyAtMidnight(timestamp) {
		    var currDate = moment.unix(timestamp).format("YYYY MM DD");
		    var sameDate = (currDate === prevDate);
		    prevDate = currDate;
		    return !sameDate;
		}

		// daily reset the occupancy at HHmm
		function ResetOccupancyAt(timeReset, timeStart) {

		    var nextReset = (timeStart !== undefined ?
				     moment.unix(timeStart.time).format("YYYYMMDD") : "00000000") + timeReset;

		    return function(timestamp) {
			var currTime = moment.unix(timestamp);
			var shouldReset = (currTime.format("YYYYMMDDHHmm") >= nextReset);
			if(shouldReset) {
			    nextReset = currTime.add(1, 'days').format("YYYYMMDD") + timeReset;
			}
			return shouldReset;
		    };
		}
		
		this.compute = function(data) {

		    for(var i = 0; i < data.length; ++i) {
			var funcReset = (data[i].siteInfo !== undefined &&
					 data[i].siteInfo.occupancyTimeReset !== undefined) ?
			    ResetOccupancyAt(data[i].siteInfo.occupancyTimeReset, data[i].data[0]) : ResetOccupancyAtMidnight;
			ComputeService.cOccupancy(data[i].data,
						  'in', 'out', 'occ', funcReset);
		    }
		};
	    }]);
})();
