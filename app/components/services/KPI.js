/**
 * @class KPI
 * @memberOf FSCounterAggregatorApp
 * @description A set of data indicators
 */

(function() {
    
    angular.module('FSCounterAggregatorApp').
	service('KPI', [ 
	    "$q",
	    "DataService",
	    "ComputeService",	    
	    function(
		$q,
		DataService,
		ComputeService
	    ) {
		
		this.getSiteCountingPeriod = function(query) {
		    
		    var deferred = $q.defer();

		    var res = { 
			query: query,
			data: undefined,
			labels: undefined,			
			total: 0
		    };
				
		    DataService.getRawDataForSiteInInterval(query.id,
							    query.period)
			.then(function(data) {
			    res.data = ComputeService.cSumForPeriod(data,
								    query.period,
								    query.groupBy,
								    query.indicator);
			    res.total = ComputeService.cSum(res.data, function(elt) { return elt.y; });
			    deferred.resolve(res);
			});
		    return deferred.promise;
		};

	    }]);
}());
	
