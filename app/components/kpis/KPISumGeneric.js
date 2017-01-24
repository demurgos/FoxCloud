/**
 * @class KPISumGeneric
 * @memberOf FSCounterAggregatorApp
 * @description Compute the sum of the available indicators
 */
(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('KPISumGeneric', [
	    "$scope",
	    "ComputeService",
	    "$controller",
	    function(
		$scope,
		ComputeService,
		$controller
	    ) {

		this.defaultController = "KPISum";
		
		this.kpis = {
		};

		this.avoid = [ "duration", "time" ];
		
		this.options = {
		    indicators: [
		    ]
		};

		this.setKPIFunc = function(id, func) {
		    if(func === undefined) {
			func = this.defaultController;
		    }
		    this.kpis[id] = $controller(func,{"$scope":$scope});
		};
		
		this.getOptionFromId = function(id) {
		    return this.options.indicators.find(function(elt) {
			return elt.id === id;
		    });
		};

		this.addOption = function(id, name) {
		    this.options.indicators.push({id: id, name: name});
		};
		
		this.updateIndicators = function(sitedata) {
		    
		    if(sitedata.data.length) {
			var elt = sitedata.data[0];
			for(var key in elt) {
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
		 * @memberOf FSCounterAggregatorApp.KPISumMax
		 */
		this.compute = function(query) {		    
		    var res = this.kpis[query.indicator].compute(query);
		    return res;
		};
		
	    }]);
}());
