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
  function mapApiSelfToLegacyUser(self) {
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
				return $http.get(url).
					then(function (ret) {
					  var mapped = mapApiSelfToLegacyUser(ret.data);
						that.currentUserData = mapped;
						return mapped;
					});
			};

			/**
			 * @function setSettings
			 * @memberOf FSCounterAggregatorApp.UserService
			 * @description change some of the user settings such as name
			 */
			this.setSettings = function (params) {
				if (myconfig.debug) {
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
			this.setPassword = function (params) {
				if (myconfig.debug) {
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
