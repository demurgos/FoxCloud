/**
 * @class SiteEditor
 */
angular.module('FSCounterAggregatorApp')
    .directive("fcaSiteEditor", function () {
	return {
            restrict: 'E',
            scope : {
		site: '=' ,
		isNewSite: '=',
		signal_submit:'&onSubmit',
		signal_close: '&onClose'
	    },
            templateUrl: "build/html/SiteEditor.html",
            
            link: function (scope) {

		scope.currentSite = {};
		
		scope.isDirty = function () {
                    return !angular.equals(scope.currentSite, scope.site) || !scope.site._id;
		};
		
		scope.submit = function () {
                    angular.copy(scope.currentSite, scope.site);
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

		scope.$watch("site", function (newVal) {
                    if(newVal) {
			scope.currentSite = angular.copy(newVal);
		    }
		});
            }
	};
    });
