/**
 * @class KPISumMax
 * @memberOf FSCounterAggregatorApp
 * @description Compute the sum or the max depending on the indicator value
 */
(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('KPISumMax', [
	    "$scope",
	    "ComputeService",
	    "$controller",
	    function(
		$scope,
		ComputeService,
		$controller
	    ) {

		this.kpis = {
		    "in": $controller("KPISum", { "$scope": $scope }),
		    "out": $controller("KPISum", { "$scope": $scope }),
		    "occ": $controller("KPIMax", { "$scope": $scope })
		};

		this.options = {
		    indicators: [
			{ id: 'in', name: 'In' },
			{ id: 'out', name: 'Out' },
			{ id: 'occ', name: 'Max Occupancy' }
		    ]
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
