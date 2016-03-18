/**
 * @class SiteService
 * @memberOf FSCounterAggregatorApp
 * @description Manages sites settings
 */
(function() {

    angular.module('FSCounterAggregatorApp').service('SiteService', [
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

	    this.getSite = function(siteId) {
		if(myconfig.debug) {
		    return $q.when({});
		} else {
		    return $http.get("/sites/" + siteId)
			.then(function(ret) {
			    return ret.data;
			});
		}
            };            
            
            this.addUser = function(siteId, userEmail, addAsAdmin) {
		if(myconfig.debug) {
		    return $q.when({});
		} else {
                    return $http.post("/sites/" + siteId + "/adduser", { 
			"email": userEmail, 
			"isAdmin": addAsAdmin 
		    }).then(function(ret) {
			return ret.data;
		    });
		}
            }; 
                        
            this.removeUser = function(siteId, userEmail, isAdmin) {
		if(myconfig.debug) {
		    return $q.when({});
		} else {
                    return $http.post("/sites/" + siteId + "/removeuser", { 
			"email": userEmail, 
			"isAdmin": isAdmin 
		    }).then(function(ret) {
			return ret.data;
		    });
		}
            };
                        
            this.addItem = function(siteId) {
		if(myconfig.debug) {
		    return $q.when({});
		} else {
                    return $http.post("/sites/" + siteId + "/additem")
			.then(function(ret) {
			    return ret.data;
			});
		}
            };
                        
            this.removeItem = function(siteId, itemId) {
		if(myconfig.debug) {
		    return $q.when({});
		} else {
                    return $http.post("/sites/" + siteId + "/removeitem/"+ itemId)
			.then(function(ret) {
			    return ret.data;
			});
		}
            };
            
            this.unlinkItem = function (siteId, itemId) {
		if(myconfig.debug) {
		    return $q.when({});
		} else {
                    return $http.post("/sites/" + siteId + "/unlinkitem/" + itemId)
			.then(function(ret) {
			    return ret.data;
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

	    this.getResource = function() {
		if(myconfig.debug) {
		    return $resource('assets/sites.json');
		} else {
		    return $resource('/sites/:siteId',
				     { userId: '@_id' });
		}
	    };

	}]);
})();
