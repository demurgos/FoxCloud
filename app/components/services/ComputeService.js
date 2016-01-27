/**
 * @class ComputeService
 * @memberOf FSCounterAggregatorApp
 * @description A set of numerical methods
 */

(function() {

 angular.module('FSCounterAggregatorApp').service('ComputeService', function() {
     

     this.createTimeIndex = function(timeStart, timeEnd, step, idxFuncValue) {
	 var index = [];
	 for(var i = 0; timeStart < timeEnd; timeStart += step, ++i) {
	     index.push(idxFuncValue(i, timeStart));
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
	     for(var j = 0; j < curIndex.length; ++j) {
		 cumul = cumulFunc(data[curIndex[j]], cumul);
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

 });

}());
