/**
 * @class SettingsUsers
 * @memberof FSCounterAggregatorApp
 * @description Controller that manages users settings
 * require administrator rights
 */
(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('SettingsUsers', [
	    '$scope',
	    '$compile',
	    'UserService',
	    'DTOptionsBuilder',
	    'DTColumnDefBuilder',
	    function(
		$scope,
		$compile,
		UserService,
		DTOptionsBuilder,
		DTColumnDefBuilder
	    ) {		
		var UserResources = UserService.getResource();

		$scope.selectAll = false;
		$scope.selectedLength = 0;
		$scope.selectedElts = {};
		$scope.user = undefined;
		$scope.isNewUser = false;
		$scope.isEditionMode = false;

		$scope.dtOptions = DTOptionsBuilder.newOptions()
		    .withOption('order', [[1, "asc"]]);

		$scope.dtColumnDefs = [
		    DTColumnDefBuilder.newColumnDef(0).notSortable(),
		    DTColumnDefBuilder.newColumnDef(1),
		    DTColumnDefBuilder.newColumnDef(2),
		    DTColumnDefBuilder.newColumnDef(3),
		    DTColumnDefBuilder.newColumnDef(4),
		    DTColumnDefBuilder.newColumnDef(5).notSortable()
		];

		$scope.toggleAll = function() {
		    $scope.selectAll = !$scope.selectAll;
		    for(var key in $scope.selectedElts) {
			$scope.selectedElts[key].selected = $scope.selectAll;
		    }
		    $scope.selectedLength = $scope.selectAll ? $scope.users.length : 0;
		};

		$scope.toggleOne = function(id) {
		    if($scope.selectedElts[id].selected) {
			$scope.selectedLength++;
			$scope.selectAll = $scope.selectedLength == $scope.users.length;
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
		
		$scope.newUser = function () {
		    $scope.switchToEditionMode();
		    $scope.isNewUser = true;
		    $scope.user = new UserResources();
		};

		$scope.editUser = function(user) {
		    $scope.switchToEditionMode();
		    $scope.isNewUser = false;
		    $scope.user = user;
		};
		
		$scope.saveUser = function() {
		    $scope.user.$save()
			.then(function() {
			    if($scope.isNewUser) {
				$scope.users.push($scope.user);
				$scope.selectedElts[$scope.user._id] = { 'selected': false,
									 'user': $scope.user };
				$scope.selectAll = $scope.selectedLength == $scope.users.length;
			    }			    
			});
		};

		$scope.deleteUser = function(user) {
		    removeUserFromArray(user);
		    user.$delete();
		};

		$scope.deleteSelectedUsers = function() {
		    for(var key in $scope.selectedElts) {
			if($scope.selectedElts[key].selected) {
			    $scope.deleteUser($scope.selectedElts[key].user);
			}
		    }
		};

		function initScope()
		{
		    $scope.users = UserResources.query(function () {

			for(var i = 0; i < $scope.users.length; ++i) {
			    $scope.selectedElts[$scope.users[i]._id] = { 'selected': false,
									 'user': $scope.users[i]
								       };
			}			

		    });		    
		}
		
		function removeUserFromArray(user)
		{                                    
		    var pos = $scope.users.indexOf(user);            
		    $scope.users.splice(pos, 1);
		    var sel = $scope.selectedElts[user._id];
		    if(sel.selected) {
			$scope.selectedLength--;
		    }
		    sel = undefined;
		    $scope.selectAll = $scope.selectedLength == $scope.users.length;
		}
		
		initScope();    		

	    }]);
})();
