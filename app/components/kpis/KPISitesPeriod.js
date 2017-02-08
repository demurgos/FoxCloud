/**
* @class KPISitesPeriod
* @memberOf FSCounterAggregatorApp
* @description Compute the sum of data for each range within a period of time
*/
'use strict';

var KPIPeriodGeneric = require('./KPIPeriodGeneric');

function KPISitesPeriod(ComputeService) {

  KPIPeriodGeneric.call(this, ComputeService);

  this.setOptions({
    indicators: [
      { id: 'in', name: 'In', func: 'KPISum' },
      { id: 'out', name: 'Out', func: 'KPISum' },
      { id: 'occ', name: 'Occupancy', func: 'KPIMean' }
    ],
    defaultIndicatorId: 'in',
    defaultRangeId: 'hours'
  });
}

KPISitesPeriod.$inject = [ "ComputeService" ];

module.exports = KPISitesPeriod;
