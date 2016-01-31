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
	    }]);    
}());
