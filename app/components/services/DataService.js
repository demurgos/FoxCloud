/**
 * @class DataService
 * @memberOf FSCounterAggregatorApp
 * @description Get Data from server
 */

(function() {

 angular.module('FSCounterAggregatorApp').service('DataService', ["$http", function($http) {
     
     /**
      * @function getRawDataForCameraInInterval
      * @memberOf FSCounterAggregatorApp.DataService
      * @description retrieve a set of camera counting data from a date range
      */
     this.getRawDataForCameraInInterval = function(cameraId, intervalBegin, intervalEnd) {	 
	 return $http.get("http://localhost/Innovisite/FoxCounterAggregator/test/data/counter1day.json");
     };
     
 }]);

}());
