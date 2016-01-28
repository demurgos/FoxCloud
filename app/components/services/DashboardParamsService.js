/**
 * @class DashboardParamsService
 * @memberOf FSCounterAggregatorApp
 * @description Manage global dashboard parameters such as periods
 **/

(function() {

    angular.module('FSCounterAggregatorApp').
	service('DashboardParamsService', function() {
	    
	    this.period = { startDate: moment().set('hour', 0).set('minute', 0),
			    endDate: moment().set('hour', 23).set('minute', 59) 
			  };
	});
}());
