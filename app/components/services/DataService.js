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
	     
	     return $http.get("assets/counter1day.json").
		//return $http.get("/items/" + siteId + "/countdata",
                // {params: {start: period.startDate.unix(), end:  period.endDate.unix()}}
		//	     ).
		 then(function(ret) {

		     // add rnd
		     for(var i = 0; i < ret.data.length; ++i) {
			 ret.data[i]["in"] = Math.floor(ret.data[i]["in"] * 2 * Math.random());
		     }

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
