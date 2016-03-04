/**
 * @class KPIMean
 * @memberOf FSCounterAggregatorApp
 * @description Compute the mean value for on a set of data indicators
 */
(function() {
    
    angular.module('FSCounterAggregatorApp').
	controller('KPIMean', [ 
	    "ComputeService",	    
	    function(
		ComputeService
	    ) {

		this.getDefaultIndicatorId = function() {
		    return "in";
		};

		this.getLabel = function(id) {
		    return "mean ".concat(id);
		};

		/**
		 * @function compute
		 * @memberOf FSCounterAggregatorApp.KPIMean
		 * @description Returns the mean value of  
		 * data within a period of time
		 */
		this.compute = function(query) {

		    var res = { 
			query: query,
			value: 0
		    };
				
		    var func = function(elt) { 
			return elt[query.indicator]; 
		    };
		    
		    for(var i = 0; i < query.data.length; ++i) {
			res.value += ComputeService.cMean(query.data[i].data, 
							  func);
		    }

		    if(query.data.length) {
			res.value = Math.round(res.value / query.data.length);
		    }

		    return res;
		};
		
	    }]);
}());
	
