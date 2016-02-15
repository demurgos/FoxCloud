/**
 * @class KPISitesPeriod
 * @memberOf FSCounterAggregatorApp
 * @description Compute the sum of data for each range within a period of time
 */
(function() {
    
    angular.module('FSCounterAggregatorApp').
	service('KPISitesPeriod', [ 
	    "ComputeService",	    
	    function(
		ComputeService
	    ) {

		this.rangeOptions = [
		    { id: '15min', name: 'Minutes' },
		    { id: 'hours', name: 'Hours' },
		    { id: 'days', name: 'Days' },
		    { id: 'week', name: 'Week' },
		    { id: 'month', name: 'Month' }
		];
		
		this.indicatorOptions = [
		    { id: 'in', name: 'In' },
		    { id: 'out', name: 'Out' }
		];

		this.getDefaultIndicatorId = function() {
		    return "in";
		};

		this.getLabel = function(id) {
		    return id;
		};

		/**
		 * @function compute
		 * @memberOf FSCounterAggregatorApp.KPISitesPeriod
		 * @description Compute the sum of data for each range within a period of time
		 */
		this.compute = function(query) {

		    var res = { 
			query: query,
			data: undefined,
			value: 0
		    };
				
		    res.data = ComputeService.cSumForPeriod(query.data,
							    query.period,
							    query.groupBy,
							    query.indicator);
		    res.value = ComputeService.cSum(res.data, function(elt) { return elt.y; });

		    return res;
		};
		
	    }]);
}());
