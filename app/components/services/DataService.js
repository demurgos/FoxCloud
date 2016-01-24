/*
 * Get Data from server
 **/

(function() {

 angular.module('FSCounterAggregatorApp').service('DataService', ["$http", function($http) {
     
     this.getRawDataForCameraInInterval = function(cameraId, intervalBegin, intervalEnd) {	 
	 return $http.get("http://localhost/Innovisite/FoxCounterAggregator/test/data/counter1day.json");
     };
     
 }]);

}());
