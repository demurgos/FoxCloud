/**
 * @class DataService
 * @memberOf FSCounterAggregatorApp
 * @description Get Data from server
 */
(function() {

 angular.module('FSCounterAggregatorApp').service('DataService', [
     "$http", 
     "$q",
     function(
	 $http,
	 $q
     ) {
	 
	 /**
	  * @function getRawDataForSiteInInterval
	  * @memberOf FSCounterAggregatorApp.DataService
	  * @description retrieve counting data for an unique site 
	  * within a period of time
	  */
	 this.getRawDataForSiteInInterval = function(siteId, period) {	 
	     
	     //$http.get("assets/counter1day.json").
	     return $http.get("http://195.132.122.186:9003/items/568a49ae78af992414ef675d/rawdata?end=" + 
			      period.endDate.unix() + "&start=" + period.startDate.unix(),
			      { withCredentials: false }
			     ).
		 then(function(ret) {
		     return { id: siteId, 
			      data: ret.data };
		 });
	 };	 

	 /**
	  * @function getRawDataForSitesInInterval
	  * @memberOf FSCounterAggregatorApp.DataService
	  * @description retrieve counting data for a set of sites
	  * within a period of time
	  */
	 this.getRawDataForSitesInInterval = function(sitesId, period) {
	     
	     var promises = [];
	     for(var i = 0; i < sitesId.length; ++i) {
		 promises.push(this.getRawDataForSiteInInterval(sitesId[i], period));
	     }
	     return $q.all(promises);
	 };
 }]);

}());
