/**
 * @class StatBox
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying global statistics
 **/
angular.module('FSCounterAggregatorApp').
    directive('fcaStatBox', function() {
	return {
	    scope: {
		bgColor: '=?',
		icon: '=?',
		label: '=?',
		value: '=?'        
	    },
	    link: function(scope, element, attr) {
		//scope.bgColor = scope.bgColor !== undefined ? scope.bgColor : 'bg-aqua';
		//scope.icon = scope.icon !== undefined ? scope.icon : 'ion-ios-download';
		scope.label = scope.label !== undefined ? scope.label : 'MyStat';
		scope.value = scope.value !== undefined ? scope.value : 'undef';
	    },
	    templateUrl: 'build/html/StatBoxView.html'
	};
    });
