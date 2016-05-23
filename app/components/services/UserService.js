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
	    this.currentUserData = {};
	    
	    /**
	     * @function getSettings
	     * @memberOf FSCounterAggregatorApp.UserService
	     * @description retrieve the user settings and cached them
	     */
	    this.getSettings = function() {
		var that = this;
		var url = myconfig.debug ? "assets/userdata.json" : "/users/current";
		return $http.get(url).
    		    then(function(ret) {
			that.currentUserData = ret.data;
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
		    return this.getSettings();
		} else {
		    var that = this;
		    return $http.post('/users/current', params);
		}
	    };

	    /**
	     * @function setPassword
	     * @memberOf FSCounterAggregatorApp.UserService
	     * @description change the current user password
	     */
	    this.setPassword = function(params) {
		if(myconfig.debug) {
		    return this.getSettings();
		} else {
		    var that = this;
		    return $http.post('/users/current/password', params);
		}
	    };
	    
	    /**
	     * @function getCachedSettings
	     * @memberOf FSCounterAggregatorApp.UserService
	     * @description get the cached user settings (a call to getSettings must be done previously)
	     */
	    this.getCachedSettings = function(){
		return this.currentUserData;
	    };
	    
	    this.getResource = function() {
		if(myconfig.debug) {

		    var fakeResource = $resource('assets/users.json');
		    angular.extend(fakeResource.prototype,
				   {
				       '$save': function() {
					   return {};
				       },
				       '$delete': function() {
					   return {};
				       },
				       '$resetPassword': function() {
					   return {};
				       }
				   });
		    return fakeResource;
		    //return $resource('assets/users.json');
		} else {
		    return $resource('/users/:userId',
				     { userId: '@_id' },
				     {
					 resetPassword: {
					     method: 'POST',
					     url: '/users/:userId/passwordreset'
					 }
				     });
		}
	    };

	    this.getIdOfFirstSiteWithAdminRights = function(siteLists) {
		if(!siteLists) {
		    return null;
		}		
		var elem = _.find(siteLists, "isadmin", true);		
		return elem ? elem._id : null;
	    };

	    this.getSiteFromId = function(siteLists, id) {
		return _.find(siteLists, "_id", id);
	    };

	    this.getFirstSiteAdmin = function(siteLists) {
		return _.find(siteLists, "isadmin", true);
	    };
	    
	    this.isSiteAdmin = function(site) {
		return site.isadmin;
	    };	    
	    
	}]);
    
}());
