/**
 * @class UserService
 * @memberOf FSCounterAggregatorApp
 * @description Get User settings from server
 */
(function () {

  /**
   * Converts a "self" resource of the v1 API (ie. `/api/v1/self`) to the legacy format (`/users/current`).
   *
   * @param self Self resource in the API v1 format
   * @return User data in the legacy format used by the application.
   */
  function mapApiSelfToLegacyCurrentUser(self) {
    if (self.type !== "user") {
      throw new Error("Unsupported actor type, expected `user` but received: " + self.type);
    }
    var user = {
      _id: self.id,
      admin: self.is_global_administrator,
      email: self.email,
      enabled: self.is_enabled,
      name: self.display_name,
      userInfo: self.app_data
    };
    var sites = [];
    for (var i = 0; i < self.data_nodes.length; i++) {
      var dataNode = self.data_nodes[i];
      console.warn("Assuming `isadmin`");
      sites.push({
        _id: dataNode.id,
        isadmin: true,
        items: []
      });
    }

    return {user: user, sites: sites};
  }

  /**
   * Converts a "user" resource of the v1 API (ie. `/api/v1/users/...`) to the legacy format (`/users/...`).
   *
   * @param apiUser user resource in the API v1 format
   * @return User data in the legacy format used by the application.
   */
  function mapApiUserToLegacyUser(apiUser) {
    if (apiUser.type !== "user") {
      throw new Error("Unsupported actor type, expected `user` but received: " + apiUser.type);
    }
    return {
      _id: apiUser.id,
      admin: apiUser.is_global_administrator,
      email: apiUser.email,
      enabled: apiUser.is_enabled,
      name: apiUser.display_name,
      userInfo: apiUser.app_data
    };
  }

  angular.module('FSCounterAggregatorApp').service('UserService', [
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
      this.currentUserData = {};

      /**
       * @function getSettings
       * @memberOf FSCounterAggregatorApp.UserService
       * @description retrieve the user settings and cached them
       */
      this.getSettings = function () {
        var that = this;
        var url = myconfig.debug ? "assets/userdata.json" : "/api/v1/self";
        return $http.get(url)
          .then(function (ret) {
            var mapped = mapApiSelfToLegacyCurrentUser(ret.data);
            that.currentUserData = mapped;
            return mapped;
          });
      };

      /**
       * @function setSettings
       * @memberOf FSCounterAggregatorApp.UserService
       * @description Update the display name of the user.
       * @param params {{username: string}}
       */
      this.setSettings = function (params) {
        if (myconfig.debug) {
          return this.getSettings();
        } else {
          var that = this;
          var body = {};
          for (var key in params) {
            if (!params.hasOwnProperty(key)) {
              continue;
            }
            switch (key) {
              case "username":
                body.display_name = params.username;
                break;
              default:
                console.warn("Update is not supported for the user key " + key + " (ignoring)");
            }
          }
          return $http.patch("/api/v1/users/" + that.currentUserData.user._id, body);
        }
      };

      /**
       * @function setPassword
       * @memberOf FSCounterAggregatorApp.UserService
       * @description change the current user password
       */
      this.setPassword = function (params) {
        if (myconfig.debug) {
          return this.getSettings();
        } else {
          var that = this;
          var oldPassword = params.oldpassword;
          var password = params.password;
          console.warn("Old password is not checked when updating the user");
          return $http.patch("/api/v1/users/" + that.currentUserData.user._id, {password: password});
        }
      };

      /**
       * @function getCachedSettings
       * @memberOf FSCounterAggregatorApp.UserService
       * @description get the cached user settings (a call to getSettings must be done previously)
       */
      this.getCachedSettings = function () {
        return this.currentUserData;
      };

      this.getResource = function () {
        if (myconfig.debug) {

          var fakeResource = $resource('assets/users.json');
          angular.extend(fakeResource.prototype,
            {
              '$save': function () {
                return {};
              },
              '$delete': function () {
                return {};
              },
              '$resetPassword': function () {
                return {};
              }
            });
          return fakeResource;
          //return $resource('assets/users.json');
        } else {
          return $resource(
            "/api/v1/users/:userId",
            {userId: "@_id"},
            {
              get: {
                method: "GET",
                transformResponse: function (data, headersGetter, status) {
                  var apiUser = angular.fromJson(data);
                  return mapApiUserToLegacyUser(apiUser);
                }
              },
              create: {
                method: "POST",
                transformRequest: function (data, headersGetter) {
                  var mapped = {};

                  for (var key in data) {
                    if (!data.hasOwnProperty(key)) {
                      continue;
                    }
                    switch (key) {
                      case "userInfo":
                        mapped.app_data = data.userInfo;
                        break;
                      case "name":
                        mapped.display_name = data.name;
                        break;
                      case "email":
                        mapped.email = data.email;
                        break;
                      case "admin":
                        mapped.is_global_administrator = data.admin;
                        break;
                      default:
                        if (key.indexOf("$") === 0) {
                          continue;
                        }
                        console.warn("Update is not supported for the user key " + key + " (ignoring)");
                    }
                  }
                  return angular.toJson(mapped);
                },
                transformResponse: function (data, headersGetter, status) {
                  var apiUser = angular.fromJson(data);
                  return mapApiUserToLegacyUser(apiUser);
                }
              },
              save: {
                method: "PATCH",
                transformRequest: function (data, headersGetter) {
                  var mapped = {};

                  for (var key in data) {
                    if (!data.hasOwnProperty(key)) {
                      continue;
                    }
                    switch (key) {
                      case "userInfo":
                        mapped.app_data = data.userInfo;
                        break;
                      case "name":
                        mapped.display_name = data.name;
                        break;
                      default:
                        if (key.indexOf("$") === 0) {
                          continue;
                        }
                        console.warn("Update is not supported for the user key " + key + " (ignoring)");
                    }
                  }
                  return angular.toJson(mapped);
                },
                transformResponse: function (data, headersGetter, status) {
                  var apiUser = angular.fromJson(data);
                  return mapApiUserToLegacyUser(apiUser);
                }
              },
              query: {
                method: "GET",
                isArray: true,
                transformResponse: function (data, headersGetter, status) {
                  var apiUsers = angular.fromJson(data);
                  var mapped = [];
                  for (var i = 0, l = apiUsers.length; i < l; i++) {
                    mapped.push(mapApiUserToLegacyUser(apiUsers[i]));
                  }
                  return mapped;
                }
              },
              remove: {
                method: "DELETE",
                transformResponse: function (data, headersGetter, status) {
                  console.log("remove");
                  console.log(data);
                  return data;
                }
              },
              delete: {
                method: "DELETE",
                transformResponse: function (data, headersGetter, status) {
                  console.log("delete");
                  console.log(data);
                  return data;
                }
              },
              resetPassword: {
                method: 'POST',
                url: '/api/v1/users/:userId/passwordreset',
                transformResponse: function (data, headersGetter, status) {
                  console.log("resetPassword");
                  console.log(data);
                  return data;
                }
              }
            }
          );
        }
      };

      this.getIdOfFirstSiteWithAdminRights = function (siteLists) {
        if (!siteLists) {
          return null;
        }
        var elem = _.find(siteLists, "isadmin", true);
        return elem ? elem._id : null;
      };

      this.getSiteFromId = function (siteLists, id) {
        return _.find(siteLists, "_id", id);
      };

      this.getFirstSiteAdmin = function (siteLists) {
        return _.find(siteLists, "isadmin", true);
      };

      this.isSiteAdmin = function (site) {
        return site.isadmin;
      };

      this.isSiteHaveHeatmap = function (site) {
        return site.siteInfo !== undefined && site.siteInfo.heatmap !== undefined;
      };

    }]);
}());
