/**
 * @class KPISitesPeriod
 * @memberOf FSCounterAggregatorApp
 * @description Compute the sum of data for each range within a period of time
 */
(function() {
    
    angular.module('FSCounterAggregatorApp').
	controller('KPISitesPeriod', [ 
	    "ComputeService",	    
	    function(
		ComputeService
	    ) {

		this.rangeParams = {
		    '15min': {
			hourMode: true,
			label: function(d, p) {
			    return moment(d).format("dddd, MMMM Do YYYY, HH:mm").concat(
				moment(d).add(15, "m").format(" - HH:mm"));
			}
		    },
		    'hours': {
		      hourMode: true,
		      label: function(d, p) {
			  return moment(d).format("dddd, MMMM Do YYYY, HH:00");
		      }
		    },
		    'days': {
		      hourMode: false,
		      label: function(d, p) {
			  return moment(d).format("dddd, MMMM Do YYYY");
		      }
		    },
		    'week': {
		      hourMode: false,
		      label: function(d, p) {
			  return moment.max(p.startDate, moment(d)).format("MMM DD YYYY").concat(
			      moment.min(moment(d).add(1, "w"), 
					 p.endDate).format(" - MMM DD YYYY"));
		      }
		    },
		    'month': {
		      hourMode: false,
		      label: function(d, p) {
			  return moment.max(p.startDate, moment(d)).format("MMM DD YYYY").concat(
			      moment.min(moment(d).add(1, "M"), 
					 p.endDate).format(" - MMM DD YYYY"));
		      }
		    }
		};

		this.indicatorParams = {
		    'in': { 
			name: 'In' 
		    },
		    'out': {
			name: 'Out' 
		    }
		};

		this.options = {

		    ranges: [
			{ id: '15min', name: 'Minutes' },
			{ id: 'hours', name: 'Hours' },
			{ id: 'days', name: 'Days' },
			{ id: 'week', name: 'Week' },
			{ id: 'month', name: 'Month' }
		    ],
		    
		    indicators: [
			{ id: 'in', name: 'In' },
			{ id: 'out', name: 'Out' }
		    ],
		    
		    defaultIndicatorId: 'in',
		    
		    defaultRangeId: 'hours',

		    getLabel: function(id) {
			return id;
		    }
		};

		/**
		 * @function getTimeFormat
		 * @memberOf FSCounterAggregator.KPISitesPeriod
		 * @description retrieve style information for a specific period range
		 */
		this.getTimeFormat = function(period, rangeId) {
		    if(period.endDate.diff(period.startDate, "weeks") > 8) {
			return "MMMM YYYY";
		    } else if(period.endDate.diff(period.startDate, "days") > 2) {
			return "MMM DD";
		    } else {
			return this.getRangeParams(rangeId).hourMode ? "HH:mm" : "MMM DD";
		    }
		};

		/**
		 * @function getRangeParams
		 * @memberOf FSCounterAggregator.KPISitesPeriod
		 * @description returns the parameters for a specific period id
		 */
		this.getRangeParams = function(id) {
		    return this.rangeParams[id];
		};

		/**
		 * @function getRangeTimeFormat
		 * @memberOf FSCounterAggregator.KPISitesPeriod
		 * @description returns the appropriate function which set the date format
		 */
		this.getRangeTimeFormat = function(rangeId) {
		    return this.getRangeParams(rangeId).label;
		};

		/**
		 * @function getIndicatorName
		 * @memberOf FSCounterAggregator.KPISitesPeriod
		 * @description returns the displayed indicator label
		 */
		this.getIndicatorName = function(indicatorId) {
		    return this.indicatorParams[indicatorId].name;
		};


		/**
		 * @function compute
		 * @memberOf FSCounterAggregatorApp.KPISitesPeriod
		 * @description Compute the sum of data for each range within a period of time
		 */
		this.compute = function(query) {

		    var res = { 
			query: query,
			data: [],
			value: []
		    };
				
		    for(var i = 0; i < query.data.length; ++i) {

			res.data.push(ComputeService.cSumForPeriod(query.data[i],
								   query.period,
								   query.groupBy,
								   query.indicator));
			res.value.push(
			    ComputeService.cSum(res.data[i], function(elt) { return elt.y; })
			);
		    }

		    return res;
		};
		
	    }]);
}());
