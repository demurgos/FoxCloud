/**
 * @class UserEditor
 */
angular.module('FSCounterAggregatorApp')
    .directive("fcaMemberEditor", function () {
	return {
            restrict: 'E',
            scope : {
		member: '=' ,
		isNewMember: '=',
		signal_submit:'&onSubmit',
		signal_close: '&onClose'
	    },
            templateUrl: "build/html/MemberEditor.html",
            
            link: function(scope) {
		scope.currentMember = { email: false, isAdmin: false };

		scope.isDirty = function() {
                    return !angular.equals(scope.currentMember, scope.member) || !scope.member.email;
		};

		scope.submit = function () {
                    angular.copy(scope.currentMember, scope.member);
                    if(scope.signal_submit) {
			scope.signal_submit();
		    }
		    scope.close();
		};
		
		scope.close = function () {
                    scope.currentMember = angular.copy(scope.member);
                    if(scope.signal_close) {
			scope.signal_close();
		    }
		};
		
		scope.$watch("member", function(newVal) {
                    if(newVal) {
			scope.currentMember = angular.copy(newVal);
		    }
		});
            }
	};
    });
