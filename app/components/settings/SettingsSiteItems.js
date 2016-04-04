/**
 * @class SettingsSiteItems
 * @memberof FSCounterAggregatorApp
 * @description Controller that manages the association between cameras and sites
 */

(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('SettingsSiteItems', [
	    '$scope',
	    'UserService',
	    'SiteService',
	    'DTOptionsBuilder',
	    function(
		$scope,
		UserService,
		SiteService,
		DTOptionsBuilder
	    ) {

		$scope.items = [];

		$scope.dtOptions = DTOptionsBuilder.newOptions();
		
		function initScope() {

		    var addItems = function(site, item) {
			$scope.items.push(angular.extend({ "site_name": site.name,
							   "site_id": site._id },
							 item));
		    };
		    
		    UserService.getSettings()
			.then(function(userData) {
			    var sites = userData.sites;
			    for(var i = 0; i < sites.length; ++i) {
				// check here if user has admin rights for this site
				var site = sites[i];
				if(SiteService.isSiteAdmin(site)) {				  
				    for(var j = 0; j < site.items.length; ++j) {
					var item = site.items[j];
					SiteService.getItem(site._id, item._id)
					    .then(addItems.bind(null, site));
				    }
				}
			    }			
			});    
		}
		
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

		initScope();
	    }]);
}());
