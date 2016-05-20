/**
 * @class UserEditor
 */
angular.module('FSCounterAggregatorApp')
    .directive("fcaUserSiteEditor", function () {
	return {
            restrict: 'E',
            scope : {
		user: '=' ,
		site: '=',
		signal_submit:'&onSubmit',
		signal_close: '&onClose'
	    },
            templateUrl: "build/html/UserSiteEditor.html",
            
            link: function(scope) {
		scope.currentUser = scope.user;

		scope.isDirty = function() {
                    return !angular.equals(scope.currentUser, scope.user);
		};
		
		scope.submit = function () {
		    angular.copy(scope.currentUser, scope.user);
                    if(scope.signal_submit) {
			scope.signal_submit();
		    }
		    scope.close();
		};
		
		scope.close = function () {
                    scope.currentUser = angular.copy(scope.user);
                    if(scope.signal_close) {
			scope.signal_close();
		    }
		};
		
		scope.$watch("user", function(newVal) {
                    if(newVal) {
			scope.currentUser = angular.copy(newVal);
		    }
		});
            }
	};
    });
