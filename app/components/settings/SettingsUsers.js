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

		$scope.dtOptions = DTOptionsBuilder.newOptions();
//		    .withOption('headerCallback', function(header) {
//			$compile(angular.element(header).contents())($scope);
//		    })
//		    .withOption('createdRow', function(row, data, dataIndex) {
//			$compile(angular.element(row).contents())($scope);
//		    });

		$scope.dtColumnDefs = [
		    DTColumnDefBuilder.newColumnDef(0).notSortable(),
		    DTColumnDefBuilder.newColumnDef(1),
		    DTColumnDefBuilder.newColumnDef(2),
		    DTColumnDefBuilder.newColumnDef(3),
		    DTColumnDefBuilder.newColumnDef(4)
		];

		$scope.toggleAll = function() {
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
		
		function initScope()
		{
		    $scope.users = UserResources.query(function () {
			if($scope.users.length>0) {
			    $scope.selecteduser = $scope.users[0];
			}

			for(var i = 0; i < $scope.users.length; ++i) {
			    $scope.selectedElts[$scope.users[i]._id] = { selected: false };
			}			

		    });
		    
		}
		
		function removeSelectedUserFromArray()
		{                                    
		    var pos = $scope.users.indexOf($scope.selecteduser);            
		    $scope.users.splice(pos, 1);
		    $scope.selecteduser = $scope.users[pos < $scope.users.length ? pos : $scope.users.length - 1];
		}

		$scope.newUser = function () { 
		    //$scope.users.push(new UserResources());
		    //$scope.selecteduser = $scope.users[$scope.users.length - 1];
		    $scope.user = new UserResources();
		};

		$scope.clearUser = function() {
		    $scope.user = undefined;
		};

		$scope.saveUser = function() {
		    $scope.user = undefined;
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
