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
		signal_submit:'&onSubmit',
		signal_close: '&onClose',
		signal_passwd_rst: '&onPasswdrst'
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
		
		scope.submit = function () {
                    angular.copy(scope.currentUser, scope.user);
                    if(scope.signal_submit) {
			scope.signal_submit();
		    }
		    scope.close();
		};
		
		scope.close = function () {
                    if(scope.signal_close) {
			scope.signal_close();
		    }
		};

		scope.resetPassword = function() {
		    if(scope.signal_passwd_rst) {
			scope.signal_passwd_rst();
		    }
		    scope.close();
		};
		
		scope.$watch("user", function (newVal) {
                    if(newVal) {
			scope.currentUser = angular.copy(newVal);
		    }
		});
            }
	};
    });
