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
		  function(
		      $http,
		      DataService,
		      UserService
		  ) {
		      
		      this.period = { startDate: moment().set('hour', 0).set('minute', 0),
				      endDate: moment().set('hour', 23).set('minute', 59) 
				    };
		      
		      this.rangeOptions = [
			  { id: '15min', name: 'Minutes' },
			  { id: 'hours', name: 'Hours' },
			  { id: 'days', name: 'Days' },
			  { id: 'week', name: 'Week' },
			  { id: 'month', name: 'Month' }
		      ];
		      
		      this.indicatorOptions = [
			  { id: 'in', name: 'In' },
			  { id: 'out', name: 'Out' }
		      ];

		      this.sites = [];

		      this.loadParams = function() {
			  
			  var that = this;
			  return UserService.getSettings().
			      then(function(data) {
				  that.sites = [];
				  for(var i = 0; i < data.sites.length; ++i) {
				      that.sites.push({ id: data.sites[i]._id,
							name: data.sites[i].name });
				  }
				  return that;
			      });
		      };

		      this.getSiteData = function(siteId) {
			  return DataService.getRawDataForSiteInInterval(siteId,
									 this.period);
		      };

		  }]);
}());
