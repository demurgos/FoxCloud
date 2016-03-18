/**
 * @class SettingsSiteUsers
 * @memberof FSCounterAggregatorApp
 * @description Controller that manages relation between users and sites
 */
(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('SettingsSiteUsers', [
	    '$scope',
	    'SiteService',
	    function(
		$scope,
		SiteService
	    ) {
		
		var pos1 = 0, pos2 = 0;
		
		function saveSelection()
		{
		    pos1 = $scope.site.usersadmin.indexOf($scope.selectedAdminUser);
		    pos2 = $scope.site.users.indexOf($scope.selectedUser);
		}
        
		function updateSiteData(newSiteInfo) {
		    if(newSiteInfo) {
			$scope.site = newSiteInfo;
			
			if(pos1 < 0) {
			    pos1 = 0;
			}
			if(pos1 >= $scope.site.usersadmin.length) {
			    pos1 = $scope.site.usersadmin.length - 1;
			}
			$scope.selectedAdminUser = $scope.site.usersadmin[pos1];
			
			if(pos2 < 0) {
			    pos2 = 0;
			}
			if(pos2 >= $scope.site.users.length) {
			    pos2 = $scope.site.users.length - 1;
			}
			$scope.selectedUser = $scope.site.users[pos2];
		    }		    
		}
		
		$scope.$watch("siteId", function(newVal) {
		    if(newVal) {
			siteservice.getSite(newVal)
			    .then(updateSiteData);
		    }
		});             
		
		$scope.add_admin_user = function() {
		    saveSelection();
		    siteservice.addUser($scope.site._id, 
					$scope.editing_admin_user, 
					true)
		    .then(updateSiteData, 
			  function(err) {                
			      $scope.editing_admin_user = '';
			  });
		};
		
		$scope.add_user = function () {
		    saveSelection();
		    siteservice.addUser($scope.site._id, 
					$scope.editing_user, 
					false)
		    .then(updateSiteData,
			  function(err) {
			      $scope.editing_user = '';
			  });
		};
		
		$scope.delete_admin_user = function () {
		    saveSelection();
		    siteservice.removeUser($scope.site._id, 
					   $scope.selectedAdminUser, 
					   true)
		    .then(updateSiteData);
		};
		
		$scope.delete_user = function () {
		    saveSelection();
		    siteservice.removeUser($scope.site._id, 
					   $scope.selectedUser, 
					   false)
		    .then(updateSiteData);
		};
		
		$scope.siteId = SiteService
		    .getIdOfFirstSiteWithAdminRights($scope.currentUserSites);		
		
	    }]);
}());
