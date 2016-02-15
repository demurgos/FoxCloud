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
	    "KPISitesPeriod",
	    function(
		ComputeService,
		KPISum,
		KPIMean,
		KPIMaxPeriod,
		KPIMaxSiteRatio,
		KPISitesPeriod
	    ) {
		this.KPIs = {
		    "sum": KPISum,
		    "mean": KPIMean,
		    "max-period": KPIMaxPeriod,
		    "max-site-ratio": KPIMaxSiteRatio,
		    "sites-period": KPISitesPeriod
		};

		this.getKPI = function(id) {
		    return this.KPIs[id];
		};		
	    }]);
}());
	
