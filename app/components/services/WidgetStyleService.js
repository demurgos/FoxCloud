/**
 * @class WidgetStyleService
 * @memberOf FSCounterAggregatorApp
 * @description Retrieve rendering style information for widgets
 */
(function() {
    
    angular.module('FSCounterAggregatorApp').
	service('WidgetStyleService', [
	    "$http", "$q", 
	    function(
	    $http, $q) {

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

		this.widgetStyles = {
		    "GraphSiteWidget": {
			"json": "assets/graphsite.json",
			"css": undefined
		    }
		};

		/**
		 * @function getDefaultRangeId
		 * @memberOf FSCounterAggregator.WidgetStyleService
		 * @description returns the default selected period range
		 */
		this.getDefaultRangeId = function() {
		    return '15min';
		};

		/**
		 * @function getDefaultIndicatorId
		 * @memberOf FSCounterAggregator.WidgetStyleService
		 * @description returns the default selected indicator
		 */
		this.getDefaultIndicatorId = function() {
		    return 'in';
		};

		/**
		 * @function getRangeParams
		 * @memberOf FSCounterAggregator.WidgetStyleService
		 * @description returns the parameters for a specific period id
		 */
		this.getRangeParams = function(id) {
		    return this.rangeParams[id];
		};

		/**
		 * @function getStyle
		 * @memberOf FSCounterAggregator.WidgetStyleService
		 * @description retrieve style information for a particular widget
		 */
		this.getStyle = function(widgetId) {
		    
		    var deferred = $q.defer();

		    $http.get(this.widgetStyles[widgetId].json).
			success(function(data, status) {
			    deferred.resolve({"json": data});
			}).
			error(function(data, status) {
			    deferred.reject(data);
			});
		    return deferred.promise;
		};		

		/**
		 * @function getTimeFormat
		 * @memberOf FSCounterAggregator.WidgetStyleService
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
		 * @function getRangeTimeFormat
		 * @memberOf FSCounterAggregator.WidgetStyleService
		 * @description returns the appropriate function which set the date format
		 */
		this.getRangeTimeFormat = function(rangeId) {
		    return this.getRangeParams(rangeId).label;
		};

		/**
		 * @function getIndicatorName
		 * @memberOf FSCounterAggregator.WidgetStyleService
		 * @description returns the displayed indicator label
		 */
		this.getIndicatorName = function(indicatorId) {
		    return this.indicatorParams[indicatorId].name;
		};

	    }]);    
}());
