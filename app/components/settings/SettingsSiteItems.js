/**
 * @class SettingsSiteItems
 * @memberof FSCounterAggregatorApp
 * @description Controller that manages the association between cameras and sites
 */

(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('SettingsSiteItems', [
	    '$scope',
	    'SiteService',
	    function(
		$scope,
		SiteService
	    ) {
		
		var pos = 0;
		
		function savePos()
		{
		    pos = $scope.site.items.indexOf($scope.selectedItem);
		}
		
		function updateSiteData(newSiteInfo)
		{
		    if(newSiteInfo) {
			$scope.site = newSiteInfo;
		    }
		    
		    if($scope.site) {
			if(pos < 0) pos = 0;
			if(pos >= $scope.site.items.length) {
			    pos = $scope.site.items.length - 1;
			}
			$scope.selectedItem = $scope.site.items[pos];
		    }		    
		}
		
		$scope.$watch("siteId", function (newVal) { 
		    if (newVal) {
			SiteService.getSite(newVal)
			    .then(updateSiteData);
		    }
		});

		$scope.add_item = function () { 
		    savePos();
		    SiteService.addItem($scope.site._id)
			.then(updateSiteData);
		};

		$scope.remove_item = function () { 
		    savePos();
		    SiteService.removeItem($scope.site._id, 
					   $scope.selectedItem._id)
			.then(updateSiteData);
		};

		$scope.unlink_item = function () { 
		    savePos(); 
		    SiteService.unlinkItem($scope.site._id, 
					   $scope.selectedItem._id)
			.then(updateSiteData);
		};
		
		$scope.siteId = SiteService.getIdOfFirstSiteWithAdminRights(
		    $scope.currentUserSites);
	    }]);
}());
