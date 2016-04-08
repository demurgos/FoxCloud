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
		      
		      this.period = { startDate: moment().hours(0).minutes(0).seconds(0).milliseconds(0),
				      endDate: moment().hours(23).minutes(59).seconds(59).milliseconds(999) 
				    };

		      // by default set it to yesterday
		      this.comparedPeriod = { startDate: this.period.startDate.clone().subtract(1, 'days'),
					      endDate: this.period.endDate.clone().subtract(1, 'days')
					    };

		      this.sites = [];

		      this.data = [];

		      // compared data must be set to empty in order
		      // to desactivate period comparisons on widget side
		      this.comparedData = undefined;
		      
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

		      function loadDataOnPeriod(sites, period) {
			  return DataService.getRawDataForSitesInInterval(
			      _.compact(sites.map(_.property("id"))),
			      period).
			      then(function(data) {
				  OccupancyIndicator.compute(data);
				  return data;
			      });
		      }
		      
		      this.loadData = function() {
			  var that = this;
			  return loadDataOnPeriod(this.sites, this.period)
			      .then(function(data) {
				  that.data = data;
				  return that;
			      });
		      };

		      this.loadDataCompared = function() {
			  var that = this;
			  return loadDataOnPeriod(this.sites, this.comparedPeriod)
			      .then(function(data) {
				  that.comparedData = data;
				  return that.loadData();
			      });
		      };

		      // must be called in order to remove comparison on widget sides
		      this.disableDataCompared = function() {
			  this.comparedData = undefined;
		      };

		      // fab: deprecated use loadData instead
		      this.getSiteData = function(siteId) {
			  return DataService.getRawDataForSiteInInterval(siteId,
									 this.period);
		      };

		      // fab: deprecated use loadData instead
		      this.getSitesData = function(sitesId) {
			  return DataService.getRawDataForSitesInInterval(sitesId,
									  this.period);
		      };

		  }]);
}());
