/**
 * @class DataService
 * @memberOf FSCounterAggregatorApp
 * @description Get Data from server
 */

(function() {

 angular.module('FSCounterAggregatorApp').service('DataService', ["$http", "$q", function($http, $q) {
     
     /**
      * @function getRawDataForCameraInInterval
      * @memberOf FSCounterAggregatorApp.DataService
      * @description retrieve a set of camera counting data from a date range
      */
     this.getRawDataForCameraInInterval = function(cameraId, period) {	 

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
