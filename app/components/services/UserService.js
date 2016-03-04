/**
 * @class UserService
 * @memberOf FSCounterAggregatorApp
 * @description Get User settings from server
 */
(function() {

 angular.module('FSCounterAggregatorApp').service('UserService', [
     "$http", 
     "useServerAPI",
     function(
	 $http,
	 useServerAPI
     ) {

	 var currentUserData = null;

	 /**
	  * @function getSettings
	  * @memberOf FSCounterAggregatorApp.UserService
	  * @description retrieve the user settings and cached them
	  */
	 this.getSettings = function() {
    	     return useServerAPI ? 
		 $http.get("/users/current").
		 then(function(ret) {
                     currentUserData = ret.data;
    		     return ret.data;
		 }) :
	     $http.get("assets/userdata.json").
    		 then(function(ret) {
                     currentUserData = ret.data;
    		     return ret.data;
    		 });
         };
	 
         /**
          * @function getCachedSettings
          * @memberOf FSCounterAggregatorApp.UserService
          * @description get the cached user settings (a call to getSettings must be done previously)
          */
	 this.getCachedSettings = function(){
             return currentUserData;
	 };
	 
     }]);        
}());
