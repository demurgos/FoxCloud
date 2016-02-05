/**
 * @class DashboardParamsService
 * @memberOf FSCounterAggregatorApp
 * @description Manage global dashboard parameters such as periods
 **/

(function() {

    angular.module('FSCounterAggregatorApp').
	service('DashboardParamsService', 
		[ "$http",
		  "$q",
		  function(
		      $http,
		      $q
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
			  
			  var deferred = $q.defer();

			  var that = this;
			  $http.get("assets/userdata.json").
			      success(function(data, status) {
				  for(var i = 0; i < data.sites.length; ++i) {
				      that.sites.push({ id: data.sites[i]._id,
							name: data.sites[i].name });
				  }
				  deferred.resolve(that);
			      }).
			      error(function(data, status) {
				  deferred.reject(data);
			      });

			  return deferred.promise;
		      };

		  }]);
}());
