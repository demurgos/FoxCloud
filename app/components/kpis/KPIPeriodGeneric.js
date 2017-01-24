/**
 * @class KPIPeriodGeneric
 * @memberOf FSCounterAggregatorApp
 * @description Compute the sum of data for each range within a period of time
 */
'use strict';

require('../services/ComputeService');

function KPIPeriodGeneric(ComputeService) {

    this.computeFuncs = {
	'KPISum': {
	    compute: function(query) {
		var res = { query: query, data: [],	value: undefined };
		
		var sumPeriod = ComputeService.cSumForPeriod(query.sitedata,
							     query.period,
							     query.groupBy,
							     query.indicator);
		res.data = sumPeriod;
		res.value = ComputeService.cSum(sumPeriod, function(elt) { return elt.y; });			    
		return res;
	    }
	},
	'KPIMean': {
	    compute: function(query) {
		var res = {	query: query, data: [],	value: undefined };
		
		var meanPeriod = ComputeService.cMeanForPeriod(query.sitedata,
							       query.period,
							       query.groupBy,
							       query.indicator);
		res.data = meanPeriod;
		res.value = Math.round(ComputeService.cMean(meanPeriod, function(elt) { return elt.y; }));			    
		return res;
	    }
	}
    };		
    
    this.defaultFunc = 'KPISum';
    
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
    
    this.kpis = {
    };
    
    this.avoid = [ "duration", "time" ];
    
    this.options = {
	
	ranges: [
	    { id: '15min', name: 'Minutes' },
	    { id: 'hours', name: 'Hours' },
	    { id: 'days', name: 'Days' },
	    { id: 'week', name: 'Weeks' },
	    { id: 'month', name: 'Months' }
	],
	
	indicators: [
	],
	
	defaultIndicatorId: undefined,
	
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
	var elt = this.getOptionFromId(indicatorId);
	if(elt !== undefined) {
	    return elt.name;
	}
	return undefined;
    };

    this.setKPIFunc = function(id, func) {
	if(func === undefined) {
	    func = this.defaultFunc;
	}
	this.kpis[id] = this.computeFuncs[func];
    };
    
    this.getOptionFromId = function(id) {
	return this.options.indicators.find(function(elt) {
	    return elt.id === id;
	});
    };

    this.setOption = function(id, name, func) {
	this.setKPIFunc(id, func);
	var elt = this.getOptionFromId(id);
	if(elt === undefined) {
	    this.addOption(id, name);
	} else {
	    elt.name = name;
	}
    };

    this.setOptions = function(options) {
	if(options.indicators !== undefined) {
	    for(var i = 0; i < options.indicators.length; ++i) {
		var elt = options.indicators[i];
		this.setOption(elt.id, elt.name, elt.func);
	    }
	}
    };
    
    this.addOption = function(id, name) {
	this.options.indicators.push({id: id, name: name});
    };
    
    this.updateIndicators = function(sitedata) {

	if(sitedata.data.length) {
	    var elt = sitedata.data[0];
	    for(var key in elt) {
		if(this.options.defaultIndicatorId === undefined) {
		    this.options.defaultIndicatorId = key;
		}
		if(this.avoid.indexOf(key) === -1) {
		    if(this.kpis[key] === undefined) {
			this.setKPIFunc(key);
		    }
		    if(this.getOptionFromId(key) === undefined) {
			this.addOption(key, key);
		    }
		}
	    }
	}
	
    };
    
    /**
     * @function compute
     * @memberOf FSCounterAggregatorApp.KPISitesPeriod
     * @description Compute the sum of data for each range within a period of time
     */
    this.compute = function(query) {
	return this.kpis[query.indicator].compute(query);
    };

}

KPIPeriodGeneric.$inject = [ "ComputeService" ];

module.exports = KPIPeriodGeneric;

