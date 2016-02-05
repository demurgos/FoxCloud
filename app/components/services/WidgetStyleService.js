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
			  return moment(d).format("dddd, MMMM Do YYYY, HH");
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
			  return moment(d).format("MMM DD YYYY").concat(
			      moment.min(moment(d).add(1, "w"), 
					 p.endDate).format(" - MMM DD YYYY"));
		      }
		    },
		    'month': {
		      hourMode: false,
		      label: function(d, p) {
			  return moment(d).format("MMM DD YYYY").concat(
			      moment.min(moment(d).add(1, "M"), 
					 p.endDate).format(" - MMM DD YYYY"));
		      }
		    }
		};

		this.widgetStyles = {
		    "GraphSiteWidget": {
			"json": "assets/graphsite.json",
			"css": undefined
		    }
		};

		this.getDefaultRangeOptions = function() {
		    return '15min';
		};

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

		this.getTimeFormat = function(period, rangeId) {
		    if(period.endDate.diff(period.startDate, "weeks") > 8) {
			return "MMMM YYYY";
		    } else if(period.endDate.diff(period.startDate, "days") > 2) {
			return "MMM DD";
		    } else {
			return this.getRangeParams(rangeId).hourMode ? "HH:mm" : "MMM DD";
		    }
		};

		this.getRangeTimeFormat = function(rangeId) {
		    return this.getRangeParams(rangeId).label;
		};

	    }]);    
}());
