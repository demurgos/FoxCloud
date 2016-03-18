/**
 * @class CurrentUser
 * @memberof FSCounterAggregatorApp
 * @description Controller that manages user settings
 */
(function() {

    angular.module('FSCounterAggregatorApp')
	.controller('CurrentUser', [
	    '$scope',
	    'UserService',
	    function(
		$scope,
		UserService
	    ) {

		$scope.username = "";

		UserService.getSettings().then(function(data) {
		    $scope.username = data.user.name;
		});

		$scope.oldPassword = "";
		$scope.newPassword = "";
		$scope.newPassword2 = "";
		
		$scope.$watch('logonUser.name', function (newVal) { $scope.username = newVal; });
		
		function validPasswords()   
		{
		    //if ($scope.oldPassword == "") { $scope.message = 'Old password is empty'; return false; }
		    if ($scope.newPassword === "") { $scope.message = 'New password is empty'; return false; }
		    if ($scope.newPassword != $scope.newPassword2) { $scope.message = 'Passwords do not match'; return false; }
		    if ($scope.oldPassword == $scope.newPassword) { $scope.message = 'Old and new passwords are identical'; return false; }
		    
		    return true;            
		}
		
		$scope.updatePassword = function() {
		    $scope.message = null;
		    
		    if (!validPasswords())
			return;
		    
		    UserService.setPassword({ "password": $scope.newPassword, 
					       "oldpassword": $scope.oldPassword })
		    .then(function() { 
			$scope.oldPassword = $scope.newPassword = $scope.newPassword2 = ""; 
		    }, 
			  function(err) { 
			      $scope.message = 'Unable to update your password'; 
			  });		    
		};
		
		$scope.refreshCurrentUserData = function() {
		};

		$scope.updateDisplayData = function () {
		    $scope.message = null;
		    
		    UserService.setSettings({ "username": $scope.username })
			.then(function () { $scope.refreshCurentUserData(); }, 
			      function (err) { $scope.message = 'Unable to update your display settings'; }
			     );
		};		
	    }]);
}());
