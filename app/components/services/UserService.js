/**
 * @class UserService
 * @memberOf FSCounterAggregatorApp
 * @description Get User settings from server
 */
(function() {

 angular.module('FSCounterAggregatorApp').service('UserService', ["$http", function($http) {

     var currentUserData = null;

     /**
      * @function getSettings
      * @memberOf FSCounterAggregatorApp.UserService
      * @description retrieve the user settings and cached them
      */
     this.getSettings = function() {
    	 return $http.get("/users/current").
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
