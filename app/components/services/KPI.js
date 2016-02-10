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

		/**
		 * @function getSiteCountingPeriod
		 * @memberOf FSCounterAggregatorApp.KPI
		 * @description Returns a promise that compute the sums of 
		 * counting for each ranges within a period of time
		 */
		this.getSiteCountingPeriod = function(query) {
		    
		    var deferred = $q.defer();

		    var res = { 
			query: query,
			data: undefined,
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

		/**
		 * @function getAllSitesTotalCountingPeriod
		 * @memberOf FSCounterAggregatorApp.KPI
		 * @description Returns a promise that compute the total
		 * of all site counting data within a period of time
		 */
		this.getAllSitesTotalCountingPeriod = function(query) {
		    var deferred = $q.defer();
		    
		    var res = { 
			query: query,
			data: undefined,
			total: 0
		    };
				
		    DataService.getRawDataForSiteInInterval(null,
							    query.period)
			.then(function(data) {
			    res.total = ComputeService.cSum(data, 
							    function(elt) { 
								return elt[query.indicator]; 
							    });
			    deferred.resolve(res);
			});

		    return deferred.promise;		    
		};

	    }]);
}());
	
