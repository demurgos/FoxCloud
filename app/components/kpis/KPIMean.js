/**
 * @class KPIMean
 * @memberOf FSCounterAggregatorApp
 * @description Compute the mean value for on a set of data indicators
 */
(function() {
    
    angular.module('FSCounterAggregatorApp').
	service('KPIMean', [ 
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
			data: undefined,
			value: 0
		    };
				
		    var func = query.indicator !== "occ" ?
			function(elt) { 
			    return elt[query.indicator]; 
			} : function(elt) {
			    return Math.abs(elt.in - elt.out);
			};

		    res.value = Math.round(ComputeService.cMean(query.data, func));
		    return res;
		};
		
	    }]);
}());
	
