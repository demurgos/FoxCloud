/**
 * @class UserEditor
 */
angular.module('FSCounterAggregatorApp')
    .directive("fcaMemberEditor", function () {
	return {
            restrict: 'E',
            scope : {
		user: '=' ,
		isNewUser: '=',
		signal_save:'&onsave',
		signal_cancel: '&oncancel'
	    },
            templateUrl: "build/html/MemberEditor.html",
            
            link: function (scope) {
		scope.currentUser = { name: "", email: "" };
		scope.isDirty = function() {
                    return !angular.equals(scope.currentUser, scope.user) || !scope.user._id;
		};

		scope.save = function () {
                    angular.copy(scope.currentUser, scope.user);
                    if (scope.signal_save) scope.signal_save();
		};
		
		scope.revert = function () {
                    scope.currentUser = angular.copy(scope.user);
                    if (scope.signal_cancel) scope.signal_cancel();
		};
		
		scope.$watch("user", function (newVal) {
                    if (newVal) scope.currentUser = angular.copy(newVal);
		});
            }
	};
    });
