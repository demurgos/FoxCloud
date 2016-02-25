/**
 * @class UserService
 * @memberOf FSCounterAggregatorApp
 * @description Get User settings from server
 */
(function() {

 angular.module('FSCounterAggregatorApp').service('UserService', ["$http", function($http) {
     
     /**
      * @function getSettings
      * @memberOf FSCounterAggregatorApp.UserService
      * @description retrieve the user settings
      */
     this.getSettings = function() {	 

	 return $http.get("/users/current").
	     then(function(ret) {
		 return ret.data;
	     });
     };
     
 }]);

}());
