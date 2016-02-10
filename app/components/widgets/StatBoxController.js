/**
 * @class StatBoxController
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying global statistics
 **/
angular.module('FSCounterAggregatorApp').
    controller('StatBoxController', [
	'$scope',
	'WidgetStyleService',
	'KPI',
	'DashboardParamsService',
	function(
	    $scope,
	    WidgetStyleService,
	    KPI,
	    DashboardParamsService
	) {

	    $scope.widgetId = 'StatBoxWidget';

	    $scope.params = DashboardParamsService;

	    DashboardParamsService.loadParams().then(function() {
		$scope.update();
	    });

	    $scope.indicatorSelected = { id: WidgetStyleService.getDefaultIndicatorId() };

	    $scope.total = 0;

	    $scope.$watch('params.period', function(oldPeriod, newPeriod) {
		if(newPeriod !== oldPeriod) {
		    $scope.update();
		}
	    });

	    $scope.update = function() {

		KPI.getAllSitesTotalCountingPeriod({ period: $scope.params.period,
						     indicator: $scope.indicatorSelected.id })
		    .then(function(res) {
			$scope.total = res.total;
		    });
	    };

	    $scope.createWidget = function() {
		
		WidgetStyleService.getStyle($scope.widgetId)
		.then(function(data) {
		});

	    };

	}])
    .directive('fcaStatBox', function() {
	return {
	    link: function(scope, element, attr) {
		scope.createWidget();
	    },
	    templateUrl: 'build/html/StatBoxView.html'
	};
    });
