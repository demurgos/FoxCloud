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


	    this.rangeOptions = [
		{ id: '15min', name: 'Minutes' },
		{ id: 'hours', name: 'Hours' },
		{ id: 'days', name: 'Days' },
		{ id: 'week', name: 'Week' },
		{ id: 'month', name: 'Month' }
	    ];

	    this.sites = [
		{ id: 0, 
		  name: "Foxstream France" },
		{ id: 1,
		  name: "BEV" },
		{ id: 2, 
		  name: "Vaulx-en-velin" },
		{ id: 3,
		  name: "Foxstream Miami" }
	    ];
	});
}());
