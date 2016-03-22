/**
 * @class TableKPI
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying statistics in a tabular format
 **/
angular.module('FSCounterAggregatorApp')
    .directive('fcaTableKpi', function() {	
	return {
	    scope: {
		params: '=',
		kpi: '='		
	    },
	    controller: [
		'$scope',
		'$q',
		'$controller',
		'WidgetStyleService',
		function(
		    $scope,
		    $q,
		    $controller,
		    WidgetStyleService
		) {
		    $scope.widgetId = "TableKPIWidget";		    
		    $scope.indicators = $scope.kpi.options.indicators;		    
		    $scope.rows = [];		   		    
		    $scope.total = {};
		    
		    $scope.$watch('params.data', function(newData, oldData) {
			if(newData !== undefined && newData.length) {
			    $scope.update();
			}
		    });

		    $scope.updateTotal = function() {
			var indicators = $scope.indicators;
			var newTotal = {};
			for(var i = 0; i < indicators.length; ++i) {
			    var res = $scope.kpi.compute({
				"indicator": indicators[i].id,
				"sitedata": { "id": "total",
					      "data": $scope.rows }
			    });
			    newTotal[indicators[i].id] = res.value;
			}
			$scope.total = newTotal;
		    };

		    $scope.updateSites = function() {
			var newTableRows = [];
			var indicators = $scope.indicators;
			for(var i = 0; i < $scope.params.sites.length; ++i) {
			    var rowSite = {
				"name": $scope.params.sites[i].name,
				"id": $scope.params.sites[i].id
			    };
			    for(var j = 0; j < indicators.length; ++j) {
				var idx = _.findIndex($scope.params.data, {
				    "id": $scope.params.sites[i].id });					
				var res = $scope.kpi.compute({
				    "indicator": indicators[j].id,
				    "sitedata": $scope.params.data[idx] });
				rowSite[indicators[j].id] = res.value;
			    }
			    newTableRows.push(rowSite);
			}
			$scope.rows = newTableRows;			
		    };
		    
		    $scope.update = function() {

			WidgetStyleService.getStyle($scope.widgetId)
			    .then(function(style) {
				$scope.setWidgetStyle(style);
				$scope.updateSites();
				$scope.updateTotal();
			    });	
		    };
		    
		    $scope.setWidgetStyle = function(style) {			
		    };
		}],
	    templateUrl: 'build/html/TableKPIView.html'
	};
    });
