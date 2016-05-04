/**
 * @class UserEditor
 */
angular.module('FSCounterAggregatorApp')
    .directive("fcaUserEditor", function () {
	return {
            restrict: 'E',
            scope : {
		user: '=' ,
		isNewUser: '=',
		signal_save:'&onsave',
		signal_cancel: '&oncancel',
		signal_passwd_rst: '&onpasswdrst'
	    },
            templateUrl: "build/html/UserEditor.html",
            
            link: function (scope) {
		scope.currentUser = { name: "", email: "" };
		scope.isDirty = function() {
                    return !angular.equals(scope.currentUser, scope.user) || !scope.user._id;
		};

		scope.isValid = function() {
		    return scope.currentUser.name.length > 0 && scope.currentUser.email.length > 0;
		};
		
		scope.save = function () {
                    angular.copy(scope.currentUser, scope.user);
                    if (scope.signal_save) scope.signal_save();
		};
		
		scope.revert = function () {
                    scope.currentUser = angular.copy(scope.user);
                    if (scope.signal_cancel) scope.signal_cancel();
		};

		scope.resetPassword = function() {
		    if(scope.signal_passwd_rst) {
			scope.signal_passwd_rst();
		    }
		};
		
		scope.$watch("user", function (newVal) {
                    if (newVal) scope.currentUser = angular.copy(newVal);
		});
            }
	};
    });
