/**
 * @class SettingsSiteItems
 * @memberof FSCounterAggregatorApp
 * @description Controller that manages the association between cameras and sites
 */

(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('SettingsSiteItems', [
	    '$scope',
	    '$compile',
	    '$routeParams',
	    'UserService',
	    'SiteService',
	    'DTOptionsBuilder',
	    'DTColumnDefBuilder',
	    function(
		$scope,
		$compile,
		$routeParams,
		UserService,
		SiteService,
		DTOptionsBuilder,
		DTColumnDefBuilder
	    ) {

		$scope.items = [];

		$scope.selectAll = false;
		$scope.selectedLength = 0; // select all checkbox optimization
		$scope.selectedElts = {};
		$scope.selectedElt = undefined;
		
		$scope.dtOptions = DTOptionsBuilder.newOptions();
		
		$scope.dtColumnDefs = [
		    DTColumnDefBuilder.newColumnDef(0).notSortable(),
		    DTColumnDefBuilder.newColumnDef(1),
		    DTColumnDefBuilder.newColumnDef(2),
		    DTColumnDefBuilder.newColumnDef(3),
		    DTColumnDefBuilder.newColumnDef(4)
		];
		
		$scope.update = function() {
		    $scope.items = $scope.selectedElt.items;
		    //$scope.itemsFull = [];
		    $scope.selectedElts = {};

		    //var addItem = function(item) {
		    //$scope.itemsFull.push(item);
		    //};		    
		    
		    for(var i = 0; i < $scope.items.length; ++i) {
			var item = $scope.items[i];
			$scope.selectedElts[item._id] = { selected: false,
							  item: $scope.items[i]
							};
		    }

		    SiteService.getItems($scope.selectedElt._id, $scope.items)
                        .then(function(itemsFull) {
			    $scope.itemsFull = itemsFull;
			});
		};

		$scope.selectElt = function(elt) {
		    $scope.selectedElt = elt;
		    $scope.selectedLength = 0;
		    $scope.selectAll = false;
		    $scope.update();
		};

		$scope.addItem = function() {
		    SiteService.addItem($scope.site._id)
			.then(function(ret) {
			    $scope.update();
			});
		};

		$scope.removeItem = function(item) {
		    SiteService.removeItem(item)
			.then(function(ret) {
			    removeItemFromArray(item);
			});
		};

		$scope.unlinkItem = function(item) {
		    SiteService.unlinkItem(item)
			.then(function(ret) {
			    $scope.update();
			});
		};

		$scope.unlinkSelectedItems = function() {
		    for(var key in $scope.selectedElts) {
			if($scope.selectedElts[key].selected) {
			    $scope.unlinkItem($scope.selectedElts[key].item);
			}
		    }
		};

		$scope.removeSelectedItems = function() {
		    for(var key in $scope.selectedElts) {
			if($scope.selectedElts[key].selected) {
			    $scope.removeItem($scope.selectedElts[key].item);
			}
		    }
		};

		function removeItemFromArray(item) {                                    
		    var pos = $scope.items.indexOf(item);            
		    $scope.users.splice(pos, 1);
		    var sel = $scope.selectedElts[item._id];
		    if(sel.selected) {
			$scope.selectedLength--;
		    }
		    sel = undefined;
		    $scope.selectAll = $scope.selectedLength == $scope.items.length;
		}
		
		function initScope() {

		    UserService.getSettings()
			.then(function(userData) {
			    if($routeParams.siteId !== undefined) {
				var site = SiteService.getSiteFromId(userData.sites,
								     $routeParams.siteId);
				if(site !== undefined && site.isadmin) {
				    $scope.selectedElt = site;
				}
			    } else {
				$scope.selectedElt = SiteService.getFirstSiteAdmin(userData.sites);
			    }			    
			    $scope.sites = userData.sites;
			    $scope.update();
			});    
		}
		
		initScope();
	    }]);
}());
