/**
 * @class KPISumMax
 * @memberOf FSCounterAggregatorApp
 * @description Compute the sum or the max depending on the indicator value
 */

var KPISumGeneric = require('./KPISumGeneric');

function KPISumMax($scope, $controller) {

    KPISumGeneric.call(this, $scope, $controller);

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

}

KPISumMax.$inject = [ "$scope", "$controller" ];

module.exports = KPISumMax;
