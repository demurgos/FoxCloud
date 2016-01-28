/**
 * @class ComputeService
 * @memberOf FSCounterAggregatorApp
 * @description A set of numerical methods
 */

(function() {

 angular.module('FSCounterAggregatorApp').service('ComputeService', function() {

     var that = this;

     this.NSEC_15MIN = 900;
     this.NSEC_HOUR = 3600;
     this.NSEC_DAY = 86400;
     this.NSEC_WEEK = 604800;

     this.rangeFunc = { '15min': { step: function(date) { return date.add(15,"m"); },
				   dist: function(date, dateStart) {
				       return that.getTimeIndex(date.unix(),
								dateStart.unix(),
								that.NSEC_15MIN);
				   }},
			'hours': { step: function(date) { return date.add(1, "h"); },
				   dist: function(date, dateStart) {
				       return that.getTimeIndex(date.unix(),
								dateStart.unix(),
								that.NSEC_HOUR);
				   }},
			'days': { step: function(date) { return date.add(1, "d"); },
				  dist: function(date, dateStart) {
				      return that.getTimeIndex(date.unix(),
							       dateStart.unix(),
							       that.NSEC_DAY);
				  }},
			'week': { step: function(date) { return date.add(1, "w"); },
				  dist: function(date, dateStart) {
				      return that.getTimeIndex(date.unix(),
							       dateStart.unix(),
							       that.NSEC_WEEK);
				  }},
			'month': { step: function(date) { return date.add(1,"M"); },
				   dist: function(date, dateStart) {
				       return (date.year()*12 + date.month()) - 
					   (dateStart.year()*12 + dateStart.month());
				   }}
		      };

     /**
      * @function getTimeIndex
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description returns the number of step interval between 2 values
      */
     this.getTimeIndex = function(time, timeStart, step) {
	 return Math.floor(time - timeStart) / step;
     };    

     /**
      * @function getTimeIndex
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description returns the function with iterate over a specific time range
      */
     this.getTimeIterator = function(step) {
	 return this.rangeFunc[step].step;
     };

     /**
      * @function createTimeIndex
      * @memberOf FSCounterAggregatorApp.ComputeService
      */
     this.createTimeIndex = function(period, stepFunc, idxFuncValue) {
	 var index = [];
	 var ts = period.startDate.clone();
	 for(var i = 0; ts.unix() < period.endDate.unix(); ++i) {
	     index.push(idxFuncValue(i, ts));
	     ts = stepFunc(ts);
	 }
	 return index;
     };

     /**
      * @function fillIndex
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description create new index
      */
     this.fillIndex = function(data, index, idxFunc) {
	 for(var i = 0; i < data.length; ++i) {
	     var idx = idxFunc(data[i]);
	     if(idx !== undefined && 
		idx >= 0 &&
		idx < index.length) {
		 if(index[idx] === undefined) {
		     index[idx] = [ i ];
		 } else {
		     index[idx].push(i);
		 }
	     }
	 }
	 return index;
     };

     /**
      * @function aggregate
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description generic function to merge data regarding indexes list
      */
     this.aggregate = function(data, index, cumulFunc) {
	 var res = [];
	 for(var i = 0; i < index.length; ++i) {
	     var cumul = cumulFunc();
	     var curIndex = index[i];
	     if(curIndex !== undefined) {
		 for(var j = 0; j < curIndex.length; ++j) {
		     cumul = cumulFunc(data[curIndex[j]], cumul);
		 }
	     }
	     res.push(cumul);
	 }
	 return res;
     };    

     /**
      * @function split
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description transpose a javascript array into a javascript object
      */
     this.split = function(data) {
	 var res = {};
	 for(var i = 0; i < data.length; ++i) {
	     for(var key in data[i]) {
		 if(res.key === undefined) {
		     res.key = [ data[i].key ];
		 } else {
		     res.push(data[i].key);
		 }
	     }
	 }
	 return res;
     };

     /**
      * @function merge
      * @memberOf FSCounterAggregatorApp.ComputeService
      * @description transpose a javascript object into a javascript array
      */
     this.merge = function(data) {
     };

     this.cSumForPeriod = function(data, period, step, id) {
	 
	 var that = this;

	 var timeIndex = this.createTimeIndex(period,
					      that.rangeFunc[step].step,
					      function() { return undefined; });				
	 timeIndex = this.fillIndex(data,
				    timeIndex,
				    function(elt) {
					return that.rangeFunc[step].dist(
					    moment(elt.time*1000), period.startDate);
				    }
				   );
	 var tdata = this.aggregate(data, 
				    timeIndex,
				    function(elt, curCumul) {
					return elt !== undefined ? 
					    curCumul + elt[id] : 0;
				    });
	 return tdata;
     };

 });

}());
