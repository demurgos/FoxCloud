/**
 * @class SiteService
 * @memberOf FSCounterAggregatorApp
 * @description Manages sites settings
 */
(function () {

  /**
   * Converts a "compound-node" resource of the v1 API to the legacy "site" format.
   *
   * @param compoundNode Self resource in the API v1 format
   * @return User data in the legacy format used by the application.
   */
  function mapApiCompoundNodeToLegacySite(compoundNode) {
    console.warn("Missing some legacy site mappings: users, admins, items");
    var usersadmin = [];
    var users = [];
    var items = [];
    return {
      _id: compoundNode.id,
      name: compoundNode.display_name,
      usersadmin: usersadmin,
      users: users,
      items: items
    };
  }

  // {
  //   "_id": "568e2a6928054e901522106b",
  //     "name": "vaulx-en-velin",
  //     "usersadmin": [
  //     "admin@foxstream.fr",
  //     "vaulx@admin"
  //   ],
  //     "users": [],
  //     "items": [
  //     {
  //       "_id": "568e2ba728054e901522106c",
  //       "mac": null,
  //       "name": "Entree 1",
  //       "pairId": "e3ba1968-30c9-4702-b1bb-29cb959b8be5",
  //       "lastUpdateTime": "2017-05-18T12:52:06.142Z",
  //       "itemid": "vaulxMAC"
  //     }
  //   ]
  // }

  angular.module('FSCounterAggregatorApp').service('SiteService', [
    "$http",
    "$resource",
    "$q",
    "myconfig",
    function (
      $http,
      $resource,
      $q,
      myconfig
    ) {

      /**
       * Get a site by ID.
       */
      this.getSite = function (siteId) {
        if (myconfig.debug) {
          return $http.get("assets/sites.json")
            .then(function (ret) {
              var sites = ret.data;
              var site;
              for (var i = 0; !site && i < sites.length; ++i) {
                if (sites[i]._id === siteId) {
                  site = sites[i];
                }
              }
              return site;
            });
        } else {
          return $http.get("/api/v1/data_nodes/" + siteId)
            .then(function (ret) {
              var mapped = mapApiCompoundNodeToLegacySite(ret.data);
              return mapped;
            });
        }
      };

      /**
       * Get an item by ID from the supplied site.
       */
      this.getItem = function (siteId, itemId) {
        return this.getSite(siteId)
          .then(function (site) {
            var item;
            if (site !== undefined) {
              for (var i = 0; !item && i < site.items.length; ++i) {
                if (site.items[i]._id == itemId) {
                  item = site.items[i];
                }
              }
            }
            return item;
          });
      };

      /**
       * Get the items with an ID in the provided list from the supplie site.
       */
      this.getItems = function (siteId, items) {
        return this.getSite(siteId)
          .then(function (site) {
            var itemsFull = [];
            if (site !== undefined) {
              for (var i = 0; i < items.length; ++i) {
                var item = _.find(site.items, ["_id", items[i]._id]);
                if (item) {
                  itemsFull.push(item);
                }
              }
            }
            return itemsFull;
          });
      };

      /**
       * Add access permissions to the supplied user.
       */
      this.addUser = function (siteId, userEmail, addAsAdmin) {
        if (myconfig.debug) {
          return $q.when({});
        } else {
          return $http.post("/sites/" + siteId + "/adduser", {
            "email": userEmail,
            "isAdmin": addAsAdmin
          }).then(function (ret) {
            return ret.data;
          });
        }
      };

      /**
       * Remove access permissions from the supplied user.
       */
      this.removeUser = function (siteId, userEmail, isAdmin) {
        if (myconfig.debug) {
          return $q.when({});
        } else {
          return $http.post("/sites/" + siteId + "/removeuser", {
            "email": userEmail,
            "isAdmin": isAdmin
          }).then(function (ret) {
            return ret.data;
          });
        }
      };

      /**
       * Add a new item to the supplied site.
       */
      this.addItem = function (siteId) {
        if (myconfig.debug) {
          return $q.when({});
        } else {
          return $http.post("/sites/" + siteId + "/additem")
            .then(function (ret) {
              return ret.data;
            });
        }
      };

      /**
       * Remove an item from the site.
       */
      this.removeItem = function (siteId, itemId) {
        if (myconfig.debug) {
          return $q.when({});
        } else {
          return $http.post("/sites/" + siteId + "/removeitem/" + itemId)
            .then(function (ret) {
              return ret.data;
            });
        }
      };

      /**
       * TODO: Check what it does.
       */
      this.unlinkItem = function (siteId, itemId) {
        if (myconfig.debug) {
          return $q.when({});
        } else {
          return $http.post("/sites/" + siteId + "/unlinkitem/" + itemId)
            .then(function (ret) {
              return ret.data;
            });
        }
      };

      /**
       * Return an Angular resource representing sites.
       */
      this.getResource = function () {
        if (myconfig.debug) {
          return $resource("assets/sites.json");
        } else {
          return $resource(
            "/api/v1/data_nodes/:siteId",
            {siteId: "@_id"},
            {
              get: {method: "GET", transformResponse: function(data, headersGetter, status) {
                return mapApiCompoundNodeToLegacySite(angular.fromJson(data));
              }},
              save: {method: "POST"},
              query: {method: "GET", isArray: true},
              remove: {method: "DELETE"},
              delete: {method: "DELETE"}
            }
          )
        }
      };
    }]);
})();
