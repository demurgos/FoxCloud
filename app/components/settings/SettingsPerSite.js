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

		// users connected to the current selected site
		$scope.users = [];
		$scope.usersadmin = [];
		$scope.allUsers = []; // users + usersadmin

		$scope.selectAll = false;
		$scope.selectedLength = 0;
		$scope.selectedElts = {};
		$scope.selectedElt = undefined; // current selected element (site)
		// used to share data between listmode & editionmode
		$scope.user = undefined;
		$scope.isEditionMode = false;
		
		$scope.dtOptions = DTOptionsBuilder.newOptions()
		    .withOption('order', [[1, "asc"]]);
		
		$scope.dtColumnDefs = [
		    DTColumnDefBuilder.newColumnDef(0).notSortable(),
		    DTColumnDefBuilder.newColumnDef(1),
		    DTColumnDefBuilder.newColumnDef(2).notSortable()
		];

		$scope.toggleAll = function() {
		    $scope.selectAll = !$scope.selectAll;
		    for(var key in $scope.selectedElts) {
			$scope.selectedElts[key].selected = $scope.selectAll;
		    }
		    $scope.selectedLength = $scope.selectAll ? $scope.allUsers.length : 0;
		};

		$scope.toggleOne = function(id) {
		    if($scope.selectedElts[id].selected) {
			$scope.selectedLength++;
			$scope.selectAll = $scope.selectedLength == $scope.allUsers.length;
		    } else {
			$scope.selectedLength--;
			$scope.selectAll = false;
		    }
		};

		$scope.switchToEditionMode = function() {
		    $scope.isEditionMode = true;
		};

		$scope.switchToListMode = function() {
		    $scope.isEditionMode = false;
		};
		
		$scope.selectElt = function(elt) {
		    $scope.selectedElt = elt;
		    $scope.update();
		};

		$scope.addUser = function() {
		    $scope.switchToEditionMode();
		    $scope.isNewUser = true;
		    $scope.user = { site: $scope.selectedElt,
				    email: "",
				    isAdmin: true };
		};

		// Actually we cannot edit user properties
		// with this view. Keep this in case
		// we want to add this functionality.
		$scope.editUser = function(user) {
		    $scope.switchToEditionMode();
		    $scope.isNewUser = false;
		    $scope.user = user;
		};

		$scope.saveUser = function() {
		    if($scope.isNewUser) {
			if($scope.user.isAdmin) {
			    $scope.usersadmin.push($scope.user.email);
			} else {
			    $scope.users.push($scope.user.email);
			}
			$scope.allUsers = _.union($scope.users, $scope.usersadmin);
			$scope.selectedElt.$save();
			$scope.selectedElts[$scope.email] = { 'selected': false,
							      'isAdmin': $scope.user.isAdmin };
			$scope.selectAll = $scope.selectedLength == $scope.allUsers.length;
		    }
		};
		
		$scope.update = function() {
		    $scope.users = $scope.selectedElt.users;
		    $scope.usersadmin = $scope.selectedElt.usersadmin;
		    $scope.allUsers = _.union($scope.users, $scope.usersadmin);
		    $scope.selectedElts = {};
		    $scope.selectedLength = 0;
		    $scope.selectAll = false;
		    var i;
		    for(i = 0; i < $scope.users.length; ++i) {
			$scope.selectedElts[$scope.users[i]] = { selected: false,
							         isAdmin: false };
		    }
		    for(i = 0; i < $scope.usersadmin.length; ++i) {
			$scope.selectedElts[$scope.usersadmin[i]] = { selected: false,
								      isAdmin: true };
		    }		    
		};

		$scope.removeUser = function(user, isAdmin) {
		    removeUserFromArray(user, isAdmin ? $scope.usersadmin : $scope.users);
		    $scope.selectedElt.$save();
		};

		$scope.removeSelectedUsers = function() {
		    for(var key in $scope.selectedElts) {
			if($scope.selectedElts[key].selected) {
			    $scope.removeUser($scope.selectedElts[key].user, $scope.selectedElts[key].isAdmin);
			}
		    }
		};		

		function removeUserFromArray(user, userArray) {
		    var pos = userArray.indexOf(user);
		    if(pos != -1) {
			userArray.splice(pos, 1);
		    } 
		    var sel = $scope.selectedElts[user.email];
		    if(sel.selected) {
			$scope.selectedLength--;
		    }
		    sel = undefined;
		    $scope.allUsers = _.union($scope.users, $scope.usersadmin);
		    $scope.selectAll = $scope.selectedLength == $scope.allUsers.length;
		}
		
		function initScope()
		{
		    // optionally initial site selection could be choosen from the $route
		    $scope.sites = SiteResources.query(function () {
			if($scope.sites.length > 0) {
			    if($routeParams.siteId === undefined) {
				$scope.selectedElt = $scope.sites[0];
			    } else {
				for(var i = 0; i < $scope.sites.length; ++i) {
				    if($scope.sites[i]._id === $routeParams.siteId) {
					$scope.selectedElt = $scope.sites[i];
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
