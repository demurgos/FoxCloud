/**
 * @class SettingsSitesUsers
 * @memberof FSCounterAggregatorApp
 * @description Controller that manages sites and users
 * require administrator rights
 */
(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('SettingsSitesUsers', [
	    '$scope',
	    '$compile',
	    'SiteService',
	    'DTOptionsBuilder',
	    'DTColumnDefBuilder',
	    function(
		$scope,
		$compile,
		SiteService,
		DTOptionsBuilder,
		DTColumnDefBuilder
	    ) {

		var SiteResources = SiteService.getResource();

		$scope.selectAll = false;
		$scope.selectedLength = 0; // select all checkbox optimization
		$scope.selectedElts = {};
		$scope.site = undefined;
		$scope.isNewSite = false;
		
		$scope.dtOptions = DTOptionsBuilder.newOptions();
		
		$scope.dtColumnDefs = [
		    DTColumnDefBuilder.newColumnDef(0).notSortable(),
		    DTColumnDefBuilder.newColumnDef(1),
		    DTColumnDefBuilder.newColumnDef(2)
		];

		$scope.toggleAll = function() {
		    for(var key in $scope.selectedElts) {
			$scope.selectedElts[key].selected = $scope.selectAll;
		    }
		    $scope.selectedLength = $scope.selectAll ? $scope.sites.length : 0;
		};

		$scope.toggleOne = function(id) {
		    if($scope.selectedElts[id].selected) {
			$scope.selectedLength++;
			$scope.selectAll = $scope.selectedLength == $scope.sites.length;
		    } else {
			$scope.selectedLength--;
			$scope.selectAll = false;
		    }
		};
		
		function initScope()
		{
		    $scope.sites = SiteResources.query(function() {

			for(var i = 0; i < $scope.sites.length; ++i) {
			    $scope.selectedElts[$scope.sites[i]._id] = { selected: false,
									 site: $scope.sites[i]
								       };
			}
			
		    });
		}
		
		function removeSiteFromArray(site)
		{                                    
		    var pos = $scope.sites.indexOf(site);            
		    $scope.sites.splice(pos, 1);
		    var sel = $scope.selectedElts[site._id];
		    if(sel.selected) {
			$scope.selectedLength--;
		    }
		    sel = undefined;
		    $scope.selectAll = $scope.selectedLength == $scope.sites.length;
		}
		
		$scope.newSite = function () {
		    $scope.isNewSite = true;
		    $scope.site = new SiteResources();
		};

		$scope.editSite = function(site) {
		    $scope.isNewSite = false;
		    $scope.site = site;
		};
		
		$scope.clearSite = function() {
		    $scope.site = undefined;
		};

		$scope.saveSite = function() {
		    if($scope.isNewSite) {
			$scope.sites.push($scope.site);
			$scope.selectedElts[$scope.site._id] = { selected: false,
								 site: $scope.site };
			$scope.selectAll = $scope.selectedLength == $scope.sites.length;
		    } else {
			$scope.site.$save();
		    }
		    $scope.site = undefined;
		};
		
		$scope.deleteSite = function(site) {
		    site.$delete();
		    removeSiteFromArray(site);
		};

		initScope();    

	    }]);
})();
