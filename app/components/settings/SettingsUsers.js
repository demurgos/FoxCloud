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
	    'UserService',
	    function(
		$scope,
		UserService
	    ) {
		
		var UserResources = UserService.getResource();
		
		function initScope()
		{
		    $scope.users = UserResources.query(function () {
			if($scope.users.length>0)
			    $scope.selecteduser = $scope.users[0];
		    });
		    
		}
		
		function removeSelectedUserFromArray()
		{                                    
		    var pos = $scope.users.indexOf($scope.selecteduser);            
		    $scope.users.splice(pos, 1);
		    $scope.selecteduser = $scope.users[pos < $scope.users.length ? pos : $scope.users.length - 1];
		}

		$scope.new_user = function () {            
		    $scope.users.push(new UserResources());
		    $scope.selecteduser = $scope.users[$scope.users.length - 1];
		};
		
		$scope.delete_user = function () {            
		    $scope.selecteduser.$delete();
		    removeSelectedUserFromArray();
		};
		
		$scope.user_updated = function () {
		    $scope.selecteduser.$save();            
		};
		
		$scope.user_cancel = function () {
		    if (!$scope.selecteduser._id)//if no id, it is a new object
			removeSelectedUserFromArray();                            
		};
		
		initScope();    		

	    }]);
})();
