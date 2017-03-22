/**
 * @class UserEditor
 */
angular.module('FSCounterAggregatorApp')
    .directive("fcaUserEditor", function () {
	return {
            restrict: 'E',
            scope : {
		user: '=' ,
		isNew: '=',
		signal_submit:'&onSubmit',
		signal_close: '&onClose'
	    },
            templateUrl: "build/html/UserEditor.html",

	    controller: [
		'$scope',
		function(
		    $scope
		) {

		    var defaultDashboard = "";
		    var emptyValue = "{ \"dashboard\": \"" + defaultDashboard + "\" }";
		    
		    $scope.forceRefresh = 0;
		    $scope.currentUser = $scope.user;

		    $scope.jsonEditor = undefined;
		    $scope.htmlEditor = undefined;


		    function setEditorValue(user) {
			if($scope.jsonEditor !== undefined) {
			    if(user !== undefined && user.userInfo !== undefined) {
				$scope.jsonEditor.setValue(angular.toJson(user.userInfo, true));
			    } else {
				$scope.jsonEditor.setValue(emptyValue);
			    }
			}			
		    }
		    
		    $scope.jsonOptions = {
			lineWrapping: true,
			lineNumbers: true,
			matchBrackets: true,
			autoCloseBrackets: true,
			autoRefresh: true,
			gutters: ["CodeMirror-lint-markers"],
			lint: true,
			mode: { "name": "javascript", "json": true },
			onLoad: function(instance) {
			    $scope.jsonEditor = instance;
			    $scope.jsonEditor.on("change", function(instance) {
				$scope.$evalAsync(function() {
				    $scope.codemirrorChanged();
				});
			    });
			    setEditorValue($scope.currentUser);
			}
		    };

		    $scope.htmlOptions = {
			lineWrapping: true,
			autoRefresh: true,
			//lineNumbers: true,
			mode: 'xml',
			onLoad: function(instance) { $scope.htmlEditor = instance; }
		    };

		    $scope.propJson = "";
		    $scope.propHTML = "";
		    
		    $scope.isDirty = function() {
			return !angular.equals($scope.currentUser, $scope.user);
		    };

		    $scope.submit = function () {
			angular.copy($scope.currentUser, $scope.user);
			if($scope.signal_submit) {
			    $scope.signal_submit();
			}
			$scope.close();
		    };

		    $scope.codemirrorChanged = function() {
			if($scope.jsonEditor !== undefined && $scope.currentUser !== undefined) {
			    // fab: angular pb with dom event must eval or compile
			    try {
				if($scope.jsonEditor.getValue() === "{}") {
				    $scope.currentUser.userInfo = undefined;
				} else {
				    jsonlint.parse($scope.jsonEditor.getValue());
				    $scope.currentUser.userInfo = angular.fromJson($scope.jsonEditor.getValue());
				}
				$scope.codeValid = true;
			    } catch(err) {
				$scope.codeValid = false;
			    }			    
			}
		    };
		    
		    $scope.close = function () {
			if($scope.signal_close) {
			    $scope.signal_close();
			}
		    };

		    $scope.resetPassword = function() {
			$scope.user.$resetPassword()
			    .then(function(user) {
				$scope.currentUser = angular.copy(user);
			    });
		    };
		    
		    $scope.$watch("user", function (newVal) {
			if(newVal) {
			    $scope.currentUser = angular.copy(newVal);
			    setEditorValue($scope.currentUser);
			    ++$scope.forceRefresh;
			}
		    });
		}]
	};
    });
