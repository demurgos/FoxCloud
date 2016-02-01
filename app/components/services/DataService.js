/**
 * @class DataService
 * @memberOf FSCounterAggregatorApp
 * @description Get Data from server
 */

(function() {

 angular.module('FSCounterAggregatorApp').service('DataService', ["$http", "$q", function($http, $q) {
     
     /**
      * @function getRawDataForSiteInInterval
      * @memberOf FSCounterAggregatorApp.DataService
      * @description retrieve a set of site counting data from a date range
      */
     this.getRawDataForSiteInInterval = function(siteId, period) {	 

	 var deferred = $q.defer();
	 
	 $http.get("assets/counter1day.json").
	     success(function(data, status) {
		 deferred.resolve(data);
	     }).
	     error(function(data, status) {
		 deferred.reject(data);
	     });

	 return deferred.promise;
     };
     
 }]);

}());
