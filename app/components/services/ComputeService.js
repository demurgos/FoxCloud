/*
 * A set of numerical methods 
 **/

(function() {

 angular.module('FSCounterAggregatorApp').service('ComputeService', function() {
     
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

     this.split = function(data) {
	 var res = {};
	 for(var i = 0; i < data.length; ++i) {
	     for(key in data[i]) {
		 if(res.key === undefined) {
		     res.key = [ data[i].key ];
		 } else {
		     res.push(data[i].key);
		 }
	     }
	 }
	 return res;
     };

     this.merge = function(data) {
     };

 });

}());
