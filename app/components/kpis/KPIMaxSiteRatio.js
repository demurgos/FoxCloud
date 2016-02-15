/**
 * @class KPIMaxSiteRatio
 * @memberOf FSCounterAggregatorApp
 * @description Retrieve the site which have the biggest amount of data
 */
(function() {
    
    angular.module('FSCounterAggregatorApp').
	service('KPIMaxSiteRatio', [ 
	    "ComputeService",	    
	    function(
		ComputeService
	    ) {

		this.getDefaultIndicatorId = function() {
		    return "in";
		};

		this.getLabel = function(id) {
		    return "";
		};

		/**
		 * @function compute
		 * @memberOf FSCounterAggregatorApp.KPIMaxSiteRatio
		 * @description Returns the site which have the biggest
		 * amount of data
		 */
		this.compute = function(query) {

		    var res = { 
			query: query,
			data: undefined,
			value: 0
		    };
				
		    res.value = "53%";
		    return res;
		};
		
	    }]);
}());
