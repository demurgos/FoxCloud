/**
 * @class KPI
 * @memberOf FSCounterAggregatorApp
 * @description A set of data indicators
 */
(function() {
    
    angular.module('FSCounterAggregatorApp').
	service('KPI', [ 
	    "ComputeService",	    
	    "KPISum",
	    "KPIMean",
	    "KPIMaxPeriod",
	    "KPIMaxSiteRatio",
	    function(
		ComputeService,
		KPISum,
		KPIMean,
		KPIMaxPeriod,
		KPIMaxSiteRatio
	    ) {

		this.KPIs = {
		    "sum": KPISum,
		    "mean": KPIMean,
		    "max-period": KPIMaxPeriod,
		    "max-site-ratio": KPIMaxSiteRatio
		};

		this.getKPI = function(id) {
		    return this.KPIs[id];
		};

		/**
		 * @function getSiteCountingPeriod
		 * @memberOf FSCounterAggregatorApp.KPI
		 * @description Returns the sums of counting for each 
		 * ranges within a period of time
		 */
		this.getSiteCountingPeriod = function(query) {
		    
		    var res = { 
			query: query,
			data: undefined,
			total: 0
		    };
				
		    res.data = ComputeService.cSumForPeriod(query.data,
							    query.period,
							    query.groupBy,
							    query.indicator);
		    res.total = ComputeService.cSum(res.data, function(elt) { return elt.y; });
		    return res;
		};
		
	    }]);
}());
	
