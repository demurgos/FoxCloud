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

		this.rangeOptions = [
		    { id: '15min', 
		      name: 'Minutes', 
		      hourMode: true,
		      label: function(d) {
			  return moment(d).format("dddd, MMMM Do YYYY, HH:mm").concat(
			      moment(d).add(15, "m").format(" - HH:mm"));
		      }
		    },
		    { id: 'hours', 
		      name: 'Hours', 
		      hourMode: true,
		      label: function(d) {
			  return moment(d).format("dddd, MMMM Do YYYY, HH");
		      }
		    },
		    { id: 'days', 
		      name: 'Days', 
		      hourMode: false,
		      label: function(d) {
			  return moment(d).format("dddd, MMMM Do YYYY");
		      }
		    },
		    { id: 'week', name: 
		      'Week', 
		      hourMode: false,
		      label: function(d) {
			  return moment(d).format("MM dd YYYY").concat(
			      moment(d).add(1, "w").format(" - MM dd YYYY"));
		      }
		    },
		    { id: 'month', 
		      name: 'Month', 
		      hourMode: false,
		      label: function(d) {
			  return moment(d).format("MM dd YYYY").concat(
			      moment(d).add(1, "m").format(" - MM dd YYYY"));
		      }
		    }
		];

		this.widgetStyles = {
		    "GraphSiteWidget": {
			"json": "assets/graphsite.json",
			"css": undefined
		    }
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

		this.getTimeFormat = function(period, range) {
		    if(period.endDate.diff(period.startDate, "weeks") > 8) {
			return "MMMM YYYY";
		    } else if(period.endDate.diff(period.startDate, "days") > 2) {
			return "MMM DD";
		    } else {
			return range.hourMode ? "HH:mm" : "MMM DD";
		    }
		};

	    }]);    
}());
