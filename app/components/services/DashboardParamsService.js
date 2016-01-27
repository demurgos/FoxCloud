/**
 * @class DashboardParamsService
 * @memberOf FSCounterAggregatorApp
 * @description Manage global dashboard parameters such as periods
 **/

(function() {

    angular.module('FSCounterAggregatorApp').
	service('DashboardParamsService', function() {
	    
	    this.period = { startDate: moment().set('hour', 0).set('minute', 0),
			    endDate: moment().set('hour', 23).set('minute', 59) };

	    var that = this;

	    this.getPeriod = function() {
		return that.period;
	    };

	    this.setPeriod = function(newPeriod) {
		console.log("startDate=" + newPeriod.startDate.format());
		console.log("endDate=" + newPeriod.endDate.format());
		that.period = newPeriod;
	    };

	});
}());
