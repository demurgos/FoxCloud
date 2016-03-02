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
			comparable: false,
			label: function(d, p) {
			    return moment(d).format("dddd, MMMM Do YYYY, HH:mm").concat(
				moment(d).add(15, "m").format(" - HH:mm"));
			},
			isPeriodComputable: function(period) {
			    return period.endDate.diff(period.startDate, "days") <= 15;
			},
		    },
		    'hours': {
			hourMode: true,
			comparable: true,
			label: function(d, p) {
			    return moment(d).format("dddd, MMMM Do YYYY, HH:00");
			},
			isPeriodComputable: function(period) {
			    return period.endDate.diff(period.startDate, "months") <= 6;
			}			
		    },
		    'days': {
			hourMode: false,
			comparable: true,
			label: function(d, p) {
			    return moment(d).format("dddd, MMMM Do YYYY");
			},
			isPeriodComputable: function(period) {
			    return period.endDate.diff(period.startDate, "years") <= 2;
			}
		    },
		    'week': {
			hourMode: false,
			comparable: true,
			label: function(d, p) {
			    return moment.max(p.startDate, moment(d)).format("MMM DD YYYY").concat(
				moment.min(moment(d).add(1, "w"), 
					   p.endDate).format(" - MMM DD YYYY"));
			},
			isPeriodComputable: function(period) {
			    return period.endDate.diff(period.startDate, "weeks") >= 1;
			}
		    },
		    'month': {
			hourMode: false,
			comparable: true,
			label: function(d, p) {
			    return moment.max(p.startDate, moment(d)).format("MMM DD YYYY").concat(
				moment.min(moment(d).add(1, "M"), 
					   p.endDate).format(" - MMM DD YYYY"));
			},
			isPeriodComputable: function(period) {
			    return period.endDate.diff(period.startDate, "months") >= 1;
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
		 * @function isPeriodComputable
		 * @memberOf FSCounterAggregator.KPISitesPeriod
		 * @description return whether or not we can compute the KPI
		 * for a specific period size
		 */
		this.isPeriodComputable = function(period, rangeId) {
		    return this.getRangeParams(rangeId).isPeriodComputable(period);
		};

		/**
		 * @function isPeriodComparable
		 * @memberOf FSCounterAggregator.KPISitesPeriod
		 * @description return whether or not this range period
		 * could be used for comparisons between multiple sets of data
		 */
		this.isPeriodComparable = function(rangeId) {
		    return this.getRangeParams(rangeId).comparable;
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
			data: []
		    };
				
		    for(var i = 0; i < query.data.length; ++i) {

			var sumPeriod = ComputeService.cSumForPeriod(query.data[i].data,
								     query.period,
								     query.groupBy,
								     query.indicator);

			res.data.push({
			    "id": query.data[i].id,
			    "data": sumPeriod,
			    "total": ComputeService.cSum(sumPeriod, function(elt) { return elt.y; })
			});
		    }

		    return res;
		};
		
	    }]);
}());
