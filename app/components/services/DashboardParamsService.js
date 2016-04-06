/**
 * @class DashboardParamsService
 * @memberOf FSCounterAggregatorApp
 * @description Manage global dashboard parameters such as periods
 **/

(function() {

    angular.module('FSCounterAggregatorApp').
	service('DashboardParamsService', 
		[ "$http",
		  "DataService",
		  "UserService",
		  "OccupancyIndicator",
		  function(
		      $http,
		      DataService,
		      UserService,
		      OccupancyIndicator
		  ) {
		      
		      this.period = { startDate: moment().hours(0).minutes(0).seconds(0),
				      endDate: moment().hours(23).minutes(59).seconds(59) 
				    };

		      this.comparedPeriod = { startDate: this.period.startDate,
					      endDate: this.period.endDate };
		      
		      this.sites = [];

		      this.data = [];

		      this.loadParams = function() {			 
			  var that = this;
			  return UserService.getSettings().
			      then(function(data) {
				  var sites = [];
				  for(var i = 0; i < data.sites.length; ++i) {
				      sites.push({ id: data.sites[i]._id,
						   name: data.sites[i].name });
				  }
				  that.sites = sites;
				  return that;
			      });
		      };

		      this.loadData = function() {
			  var that = this;
			  return DataService.getRawDataForSitesInInterval(
			      _.compact(this.sites.map(_.property("id"))),
			      this.period).
			      then(function(data) {
				  OccupancyIndicator.compute(data);
				  that.data = data;
				  return that;
			      });
		      };

		      this.getSiteData = function(siteId) {
			  return DataService.getRawDataForSiteInInterval(siteId,
									 this.period);
		      };

		      this.getSitesData = function(sitesId) {
			  return DataService.getRawDataForSitesInInterval(sitesId,
									  this.period);
		      };

		  }]);
}());
