/**
 * @class SettingsSites
 * @memberof FSCounterAggregatorApp
 * @description Controller that manages sites
 * require administrator rights
 */
(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('SettingsSites', [
	    '$scope',
	    'SiteService',
	    function(
		$scope,
		SiteService
	    ) {

		var SiteResources = SiteService.getResource();
		
		function initScope()
		{
		    $scope.sites = SiteResources.query(function () {
			if ($scope.sites.length > 0) {
			    $scope.selectedsite = $scope.sites[0];
			}
		    });
		    
		    $scope.editing_site = "";
		    $scope.editing_user = "";
		    
		    $scope.$watch("selectedsite", function (newVal) {
			if(newVal && newVal.usersadmin.length>0)            
			    $scope.selecteduser = newVal.usersadmin[0];
		    });            
		}
        
		function removeSelectedSiteFromArray()
		{                                    
		    var pos = $scope.sites.indexOf($scope.selectedsite);            
		    $scope.sites.splice(pos, 1);
		    $scope.selectedsite = $scope
			.sites[pos < $scope.sites.length ? 
			       pos : $scope.sites.length - 1];
		}
		
		$scope.add_site = function () {
		    $scope.sites.push(new SiteResources(
			{
			    name: $scope.editing_site,
			    usersadmin : [],
			    users : [],
			    items : []
			}));
		    $scope.selectedsite = $scope.sites[$scope.sites.length - 1];
		    $scope.selectedsite.$save();
		    $scope.editing_site = "";
		};
		
		$scope.delete_site = function ()
		{            
		    $scope.selectedsite.$delete();
		    removeSelectedSiteFromArray();
		};
		
		$scope.rename_site = function () {
		    $scope.selectedsite.name = $scope.editing_site;
		    $scope.selectedsite.$save();
		};
		
		$scope.add_user = function ()
		{
		    $scope.selectedsite.usersadmin.push($scope.editing_user);
		    $scope.selectedsite.$save();
		    $scope.editing_user = "";
		    
		    if(!$scope.selecteduser) {
			$scope.selecteduser = $scope.selectedsite.usersadmin[0];
		    }
		};
        
		$scope.delete_user = function () {
		    var pos = $scope.selectedsite.usersadmin
			.indexOf($scope.selecteduser);
		    
		    $scope.selectedsite.usersadmin.splice(pos, 1);
		    $scope.selecteduser = 
			$scope.selectedsite
			.usersadmin[pos < $scope.selectedsite.usersadmin.length ? 
				    pos : $scope.selectedsite.usersadmin.length - 1];
		    
		    $scope.selectedsite.$save();                                    
		};

        initScope();    


	    }]);
})();
