/**
 * @class SiteService
 * @memberOf FSCounterAggregatorApp
 * @description Manages sites settings
 */
(function() {

    angular.module('FSCounterAggregatorApp').service('SiteService', [
	"$http",
	"$q",
	"myconfig",
	function(
	    $http,
	    $q,
	    myconfig
	) {

	    this.getSite = function(siteId, cb) {
		if(myconfig.debug) {
		    return $q.when({});
		} else {
		    return $http.get("/sites/" + siteId)
			.then(function(ret) {
			    return ret.data;
			});
		}
            };            
            
            this.addUser = function(siteId, userEmail, addAsAdmin, cb) {
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
                        
            this.removeUser = function(siteId, userEmail, isAdmin, cb) {
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
                        
            this.addItem = function(siteId, cb) {
		if(myconfig.debug) {
		    return $q.when({});
		} else {
                    return $http.post("/sites/" + siteId + "/additem")
			.then(function(ret) {
			    return ret.data;
			});
		}
            };
                        
            this.removeItem = function(siteId, itemId, cb) {
		if(myconfig.debug) {
		    return $q.when({});
		} else {
                    return $http.post("/sites/" + siteId + "/removeitem/"+ itemId)
			.then(function(ret) {
			    return ret.data;
			});
		}
            };
            
            this.unlinkItem = function (siteId, itemId, cb) {
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

	}]);
})();
