/**
 * @class KPITypicalDay
 * @memberOf FSCounterAggregatorApp
 * @description Compute the sum of data for each range within a period of time
 */
(function() {

    angular.module('FSCounterAggregatorApp').
	controller('KPITypicalDay', [
	    "ComputeService",
	    function(
		ComputeService
	    ) {
        var _startDate = moment([1970, 0, 4]);
		this.rangeParams = {
		    'days': {
			label: function(d, p) {
			    return moment(d).format("HH:mm");
			},
			isPeriodComputable: function(period) {
			    return period.endDate.diff(period.startDate, "days") >= 1;
			},
            getNormalisedTimestamp: function(timestamp){//return a uniform timestamp with respect to the aggragation option
                return _startDate.clone().add( moment.unix(timestamp).hours(), "hours").unix();
            },
            getDefaultValues : function(){
                var ret={};
                for(var i=0;i<24;i++)
                    ret[this.getNormalisedTimestamp(i * 3600)] = 0;
                return ret;
            }

		    },
		    'week': {
			label: function(d, p) {
			    return moment(d).format("dddd");
			},
			isPeriodComputable: function(period) {
			    return period.endDate.diff(period.startDate, "weeks") >= 1;
			},
            getNormalisedTimestamp: function(timestamp){
                return _startDate.clone().add(moment.unix(timestamp).days(), "days").unix();
            },
            getDefaultValues : function(){
                var ret={};
                for(var i=0;i<24;i++)
                    ret[this.getNormalisedTimestamp(i * 3600 * 24)] = 0;
                return ret;
            }
		    }
		};

		this.indicatorParams = {
		    'in': {name: 'In'},
		    'out': {name: 'Out'},
		    'occ': {name: 'Occupancy'}
		};

		this.options = {

		    ranges: [
			{ id: 'days', name: 'Days' },
			{ id: 'week', name: 'Week' }
		    ],

		    indicators: [
			{ id: 'in', name: 'In' },
			{ id: 'out', name: 'Out' },
			{ id: 'occ', name: 'Occupancy' }
		    ],

		    defaultIndicatorId: 'in',

		    defaultRangeId: 'days',

		    getLabel: function(id) {
			return id;
		    }
		};

		/**
		 * @function getTimeFormat
		 * @memberOf FSCounterAggregator.KPITypicalDay
		 * @description retrieve style information for a specific period range
		 */
		this.getTimeFormat = function(period, rangeId) {
			return rangeId==='days' ? "HH:mm" : "ddd";
		};

		/**
		 * @function isPeriodComputable
		 * @memberOf FSCounterAggregator.KPITypicalDay
		 * @description return whether or not we can compute the KPI
		 * for a specific period size
		 */
		this.isPeriodComputable = function(period, rangeId) {
		    return true;
		};

		/**
		 * @function isPeriodComparable
		 * @memberOf FSCounterAggregator.KPITypicalDay
		 * @description return whether or not this range period
		 * could be used for comparisons between multiple sets of data
		 */
		this.isPeriodComparable = function(rangeId) { return false;	};

		/**
		 * @function getRangeParams
		 * @memberOf FSCounterAggregator.KPITypicalDay
		 * @description returns the parameters for a specific period id
		 */
		this.getRangeParams = function(id) {
		    return this.rangeParams[id];
		};

		/**
		 * @function getRangeTimeFormat
		 * @memberOf FSCounterAggregator.KPITypicalDay
		 * @description returns the appropriate function which set the date format
		 */
		this.getRangeTimeFormat = function(rangeId) {
		    return this.getRangeParams(rangeId).label;
		};

		/**
		 * @function getIndicatorName
		 * @memberOf FSCounterAggregator.KPITypicalDay
		 * @description returns the displayed indicator label
		 */
		this.getIndicatorName = function(indicatorId) {
		    return this.indicatorParams[indicatorId].name;
		};

        function keepObjValue(objValue, srcValue) { return _.isUndefined(objValue) ? srcValue : objValue;}

		/**
		 * @function compute
		 * @memberOf FSCounterAggregatorApp.KPITypicalDay
		 * @description Compute the sum of data for each range within a period of time
		 */
		this.compute = function(query) {
            var startDate = moment();
		    var res = {
			query: query,
			data: [],
			value: undefined
		    };

            var rangeParams = this.getRangeParams(query.groupBy);

            if(!query.indicator)
                query.indicator = this.getDefaultIndicatorId();

            res.data =_.chain(query.sitedata)
                //group elements by the requested interval
                .groupBy(function(siteElement){
                    return rangeParams.getNormalisedTimestamp(+siteElement.time);
                })
                //compute the average for each group
                .mapValues(function(allElementsForAMoment){
                    return allElementsForAMoment.length===0 ? 0 :
                        _.sumBy(allElementsForAMoment, query.indicator);
                })
                //fill missing values
                .assignWith(rangeParams.getDefaultValues(), keepObjValue)//fill missing values
                //convert to an array of {x, y}
                .map(function(val, key){
                    return {x : moment.unix(key), y:val};
                })
                .value();

            res.value = _.sumBy(res.data, "y");
		    return res;
		};

	    }]);
}());
