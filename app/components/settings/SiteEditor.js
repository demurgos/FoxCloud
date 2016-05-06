/**
 * @class SiteEditor
 */
angular.module('FSCounterAggregatorApp')
    .directive("fcaSiteEditor", function () {
	return {
            restrict: 'E',
            scope : {
		site: '=' ,
		isNew: '=',
		signal_submit:'&onSubmit',
		signal_close: '&onClose'
	    },
            templateUrl: "build/html/SiteEditor.html",
            
            link: function (scope) {

		scope.currentSite = scope.site;
		
		scope.isDirty = function () {
                    return !angular.equals(scope.currentSite, scope.site);
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
