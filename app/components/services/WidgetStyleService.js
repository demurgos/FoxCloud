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

		this.widgetStyles = {
		    "GraphKPIWidget": {
			"json": "assets/graphsite.json",
			"css": undefined
		    },
		    "StatBoxWidget": {
			"json": "assets/statbox.json",
			"css": undefined
		    },
		    "TotalInWidget": {
			"json": "assets/statbox.json",
			"css": undefined
		    }
		};

		/**
		 * @function getStyle
		 * @memberOf FSCounterAggregator.WidgetStyleService
		 * @description retrieve style information for a particular widget
		 */
		this.getStyle = function(widgetId) {
		    if(this.widgetStyles[widgetId] === undefined) {
			return $q.when({});
		    } else {
			return $http.get(this.widgetStyles[widgetId].json).
			    then(function(ret) {
				return { "json": ret.data };
			    });
		    }
		};		

	    }]);    
}());
