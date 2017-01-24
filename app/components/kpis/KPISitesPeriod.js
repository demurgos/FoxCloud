/**
 * @class KPISitesPeriod
 * @memberOf FSCounterAggregatorApp
 * @description Compute the sum of data for each range within a period of time
 */
'use strict';

var KPIPeriodGeneric = require('./KPIPeriodGeneric');

function KPISitesPeriod(ComputeService) {

    KPIPeriodGeneric.call(this, ComputeService);

    this.kpis = {
	'in': this.computeFuncs['KPISum'],
	'out': this.computeFuncs['KPISum'],
	'occ': this.computeFuncs['KPIMean']
    };	
    
    this.options.indicators = [
	{ id: 'in', name: 'In' },
	{ id: 'out', name: 'Out' },
	{ id: 'occ', name: 'Occupancy' }
    ];
    this.options.defaultIndicatorId = 'in';
    this.options.defaultRangeId = 'hours';
}

KPISitesPeriod.$inject = [ "ComputeService" ];

module.exports = KPISitesPeriod;

