/**
 * @class UserService
 * @memberOf FSCounterAggregatorApp
 * @description Get User settings from server
 */
(function() {

    angular.module('FSCounterAggregatorApp').service('UserService', [
	"$http", 
	"$resource",
	"$q",
	"myconfig", 
	function(
	    $http, 
	    $resource,
	    $q,
	    myconfig
	) {
	    var currentUserData = null;
	    
	    /**
	     * @function getSettings
	     * @memberOf FSCounterAggregatorApp.UserService
	     * @description retrieve the user settings and cached them
	     */
	    this.getSettings = function() {
		
		var url = myconfig.debug ? "assets/userdata.json" : "/users/current";
		return $http.get(url).
    		    then(function(ret) {
			currentUserData = ret.data;
    			return ret.data;
		    });
	    };
	    
	    /**
	     * @function setSettings
	     * @memberOf FSCounterAggregatorApp.UserService
	     * @description change some of the user settings such as name
	     */
	    this.setSettings = function(params) {
		if(myconfig.debug) {
		    return $q.when({});
		} else {
		    return $http.post('/user/current', params);
		}
	    };

	    /**
	     * @function setPassword
	     * @memberOf FSCounterAggregatorApp.UserService
	     * @description change the current user password
	     */
	    this.setPassword = function(params) {
		if(myconfig.debug) {
		    return $q.when({});
		} else {
		    return $http.post('/users/current/password', params);
		}
	    };
	    
	    /**
	     * @function getCachedSettings
	     * @memberOf FSCounterAggregatorApp.UserService
	     * @description get the cached user settings (a call to getSettings must be done previously)
	     */
	    this.getCachedSettings = function(){
		return currentUserData;
	    };

	    this.getResource = function() {
		if(myconfig.debug) {
		    return $resource('assets/users.json');
		} else {
		    return $resource('/users/:userId',
				     { userId: '@_id' });
		}
	    };
	    
	}]);
    
}());
