/**
 * @class DataService
 * @memberOf FSCounterAggregatorApp
 * @description Get Data from server
 */
(function() {

 angular.module('FSCounterAggregatorApp').service('DataService', ["$http", function($http) {
     
     /**
      * @function getRawDataForSiteInInterval
      * @memberOf FSCounterAggregatorApp.DataService
      * @description retrieve a set of site counting data from a date range
      */
     this.getRawDataForSiteInInterval = function(siteId, period) {	 

	 //$http.get("assets/counter1day.json").
	 return $http.get("http://195.132.122.186:9003/items/568a49ae78af992414ef675d/rawdata?end=" + 
			  period.endDate.unix() + "&start=" + period.startDate.unix(),
			  { withCredentials: false }
			 ).
	     then(function(ret) {
		 return ret.data;
	     });
     };
     
 }]);

}());
