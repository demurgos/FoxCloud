/**
 * @class KPIMaxPeriod
 * @memberOf FSCounterAggregatorApp
 * @description Retrieve the period which have the max indicator value
 */
(function() {
    
    angular.module('FSCounterAggregatorApp').
	controller('KPIMaxPeriod', [ 
	    "ComputeService",	    
	    function(
		ComputeService
	    ) {

		this.getDefaultIndicatorId = function() {
		    return "in";
		};

		this.getLabel = function(id) {
		    return "max period";
		};

		/**
		 * @function compute
		 * @memberOf FSCounterAggregatorApp.KPIMaxPeriod
		 * @description Returns the period which have the max value
		 */
		this.compute = function(query) {

		    var res = { 
			query: query,
			data: undefined,
			value: 0
		    };
				
		    var step = "hours";

		    var timeIndex = ComputeService.
			createFixedLengthIndex(24,
					       function() { return undefined; });
		    
		    timeIndex = ComputeService.
			fillIndex(query.data,
				  timeIndex,
				  function(elt) {
				      return moment(elt.time*1000).hour();
				  }
				 );

		    var tdata = ComputeService.
			aggregate(query.data,
				  timeIndex,
				  function(elt, curCumul) {
				      return curCumul !== undefined ? 
					  curCumul + elt[query.indicator] : 0;
				  });

		    var maxElt = ComputeService.cMax(tdata,
						    function(elt) {
							return elt.y;
						    }); 
		    res.value = maxElt.x + "h";
		    return res;
		};
		
	    }]);
}());
	
