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
                getGroupingTimestamp : function(timestamp) //return the function to be used when grouping timestmaps
                {
                    return moment.unix(timestamp).minutes(0).seconds(0).millisecond(0).unix();
                },
                getNormalisedTimestamp: function(timestamp){//return a uniform timestamp with respect to the aggragation option
                    return _startDate.clone().add( moment.unix(timestamp).hours(), "hours").unix();
                },
                getDefaultValues : function(){//the values which should be present in the output array
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
                getGroupingTimestamp : function(timestamp) //return the function to be used when grouping timestmaps
                {
                    return moment.unix(timestamp).hours(0).minutes(0).seconds(0).millisecond(0);
                },
                getNormalisedTimestamp: function(timestamp){
                    return _startDate.clone().add(moment.unix(timestamp).days(), "days").unix().unix();
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
		this.isPeriodComputable = function(period, rangeId) { return true; };

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

            function groupFnctForIndicator(arr, indicator)
            {
                if(arr.length === 0) return 0;

                var ret =_.sumBy(arr, indicator);
                if(indicator=="occ")ret/=arr.length;
                return ret;
            }

            var rangeParams = this.getRangeParams(query.groupBy);

            if(!query.indicator)
                query.indicator = this.getDefaultIndicatorId();

            //in the case of a typical day: compute the sum for each hour (day 1 hour1, day 1 hour 2, day 2 hour 1, day 2 hour 2, ...)
            // then compute the average for identical hours (hour 1, hour 2, ...)
            res.data =_.chain(query.sitedata)

                //group elements to get the basic elements (hours or day)
                .groupBy(function(siteElement){
                    return rangeParams.getGroupingTimestamp(+siteElement.time);
                })
                //compute the sum/avg for each group
                .mapValues(function(allElementsForAMoment){
                    return groupFnctForIndicator(allElementsForAMoment,  query.indicator);
                })
                //convert to an array
                .map(function(val, key){
                    return { time : key, value:val};
                })

                //group elements by the requested interval to compute the average day/week
                .groupBy(function(siteElement){
                    return rangeParams.getNormalisedTimestamp(+siteElement.time);
                })
                //compute the average for each group
                .mapValues(function(allElementsForAMoment){
                    return allElementsForAMoment.length===0 ? 0 :
                        _.sumBy(allElementsForAMoment, "value") /  allElementsForAMoment.length;
                })
                //fill missing values
                .assignWith(rangeParams.getDefaultValues(), keepObjValue)//fill missing values
                //convert to an array of {x, y}
                .map(function(val, key){
                    return {x : moment.unix(key), y:Math.round(val)};
                })

                .value();

            res.value = _.sumBy(res.data, "y");
		    return res;
		};

	    }]);
}());
