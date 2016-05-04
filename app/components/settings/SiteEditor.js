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
		signal_save:'&onsave',
		signal_cancel: '&oncancel'
	    },
            templateUrl: "build/html/SiteEditor.html",
            
            link: function (scope) {
		scope.currentSite = {};
		scope.isDirty = function () {
                    return !angular.equals(scope.currentSite, scope.site) || !scope.site._id;
		};
		
		scope.save = function () {
                    angular.copy(scope.currentSite, scope.site);
                    if (scope.signal_save) scope.signal_save();
		};
		
		scope.revert = function () {
                    scope.currentSite = angular.copy(scope.site);
                    if (scope.signal_cancel) scope.signal_cancel();
		};

		scope.$watch("site", function (newVal) {
                    if (newVal) scope.currentSite = angular.copy(newVal);
		});
            }
	};
    });
