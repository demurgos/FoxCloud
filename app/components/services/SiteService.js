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
		    return $http.get("assets/sites.json")
			.then(function(ret) {
			    var sites = ret.data;
			    var site;
			    for(var i = 0; !site && i < sites.length; ++i) {
				if(sites[i]._id === siteId) {
				    site = sites[i];
				}
			    }
			    return site;
			});
		} else {
		    return $http.get("/sites/" + siteId)
			.then(function(ret) {
			    return ret.data;
			});
		}
            };            

	    this.getItem = function(siteId, itemId) {
		return this.getSite(siteId)
		    .then(function(site) {
			var item;
			if(site !== undefined) {
			    for(var i = 0; !item && i < site.items.length; ++i) {
				if(site.items[i]._id == itemId) {
				    item = site.items[i];
				}
			    }
			}
			return item;
		    });			
	    };

	    this.getItems = function(siteId, items) {
		return this.getSite(siteId)
		    .then(function(site) {
			var itemsFull = [];
			if(site !== undefined) {
			    for(var i = 0; i < items.length; ++i) {
				var item = _.find(site.items, [ "_id", items[i]._id ]);
				if(item) {
				    itemsFull.push(item);
				}
			    }
			}
			return itemsFull;
		    });			
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

	    this.getSiteFromId = function(siteLists, id) {
		return _.find(siteLists, "_id", id);
	    };

	    this.getFirstSiteAdmin = function(siteLists) {
		return _.find(siteLists, "isadmin", true);
	    };
	    
	    this.isSiteAdmin = function(site) {
		return site.isadmin;
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
