/**
 * @class SettingsPerSite
 * @memberof FSCounterAggregatorApp
 * @description Controller that manages single site
 * require administrator rights
 */
(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('SettingsPerSite', [
	    '$scope',
	    '$compile',
	    '$routeParams',
	    'SiteService',
	    'DTOptionsBuilder',
	    'DTColumnDefBuilder',
	    function(
		$scope,
		$compile,
		$routeParams,
		SiteService,
		DTOptionsBuilder,
		DTColumnDefBuilder
	    ) {

		var SiteResources = SiteService.getResource();

		$scope.selectAll = false;
		$scope.selectedLength = 0; // select all checkbox optimization
		$scope.selectedElts = {};
		$scope.selectedSite = undefined;
		
		$scope.dtOptions = DTOptionsBuilder.newOptions()
		    .withOption('headerCallback', function(header) {
			$compile(angular.element(header).contents())($scope);
		    })
		    .withOption('createdRow', function(row, data, dataIndex) {
			$compile(angular.element(row).contents())($scope);
		    });
		
		$scope.dtColumnDefs = [
		    DTColumnDefBuilder.newColumnDef(0).notSortable(),
		    DTColumnDefBuilder.newColumnDef(1),
		    DTColumnDefBuilder.newColumnDef(2)
		];

		$scope.toggleAll = function() {
		    for(var key in $scope.selectedElts) {
			$scope.selectedElts[key].selected = $scope.selectAll;
		    }
		    $scope.selectedLength = $scope.selectAll ? $scope.users.length + $scope.usersadmin.length : 0;
		};

		$scope.toggleOne = function(id) {
		    if($scope.selectedElts[id].selected) {
			$scope.selectedLength++;
			$scope.selectAll = $scope.selectedLength == ($scope.users.length + $scope.usersadmin.length);
		    } else {
			$scope.selectedLength--;
			$scope.selectAll = false;
		    }
		};

		$scope.selectSite = function(site) {
		    $scope.selectedSite = site;
		    $scope.selectedLength = 0;
		    $scope.selectAll = false;
		    $scope.update();
		};

		$scope.isUserSelected = function(user) {
		    return $scope.selectedElts[user].selected;
		};
		
		$scope.update = function() {
		    var i;
		    $scope.users = $scope.selectedSite.users;
		    $scope.usersadmin = $scope.selectedSite.usersadmin;
		    $scope.selectedElts = {};
		    for(i = 0; i < $scope.users.length; ++i) {
			$scope.selectedElts[$scope.users[i]] = { selected: false };
		    }
		    for(i = 0; i < $scope.usersadmin.length; ++i) {
			$scope.selectedElts[$scope.usersadmin[i]] = { selected: false };
		    }		    
		};
		
		function initScope()
		{
		    $scope.sites = SiteResources.query(function () {
			if($scope.sites.length > 0) {
			    if($routeParams.siteId === undefined) {
				$scope.selectedSite = $scope.sites[0];
			    } else {
				for(var i = 0; i < $scope.sites.length; ++i) {
				    if($scope.sites[i]._id === $routeParams.siteId) {
					$scope.selectedSite = $scope.sites[i];
					break;
				    }
				}
			    }
			    $scope.update();
			}					
		    });
		}
		
		initScope();

	    }]);
})();
