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
		'DTOptionsBuilder',
		function(
		    $scope,
		    $q,
		    $controller,
		    WidgetStyleService,
		    DTOptionsBuilder
		) {
		    $scope.widgetId = "TableKPIWidget";		    
		    $scope.indicators = $scope.kpi.options.indicators;		    
		    $scope.rows = [];		   		    
		    $scope.total = {};

		    $scope.periodComparisonSelected = false;
		    
		    $scope.dtOptions = DTOptionsBuilder.newOptions();

		    $scope.$on('event:dataTableLoaded', function(event, loadedDT) {
			// loadedDT === {"id": "foobar", "DataTable": oTable, "dataTable": $oTable}			
			// loadedDT.DataTable is the DataTable API instance
			// loadedDT.dataTable is the jQuery Object
			// See http://datatables.net/manual/api#Accessing-the-API
			loadedDT.dataTable.rowGrouping();
		    });
		    
		    $scope.$watch('params.data', function(newData, oldData) {
			if(newData !== undefined && newData.length) {
			    $scope.update();
			}
		    });

		    $scope.$watch('params.comparedData', function(newData, oldData) {
			if(newData !== undefined && newData.length) {
			    $scope.periodComparisonSelected = true;
			} else if($scope.periodComparisonSelected) {
			    $scope.periodComparisonSelected = false;
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
			var idx, res, j;
			for(var i = 0; i < $scope.params.sites.length; ++i) {
			    var rowSite = {
				"name": $scope.params.sites[i].name,
				"id": $scope.params.sites[i].id
			    };
			    for(j = 0; j < indicators.length; ++j) {
				idx = _.findIndex($scope.params.data, {
				    "id": $scope.params.sites[i].id });					
				res = $scope.kpi.compute({
				    "indicator": indicators[j].id,
				    "sitedata": $scope.params.data[idx] });
				rowSite[indicators[j].id] = res.value;
			    }
			    newTableRows.push(rowSite);
			    rowSite = {
				"name": $scope.params.sites[i].name,
				"id": $scope.params.sites[i].id
			    };
			    if($scope.periodComparisonSelected) {
				for(j = 0; j < indicators.length; ++j) {
				    idx = _.findIndex($scope.params.comparedData, {
					"id": $scope.params.sites[i].id });					
				    res = $scope.kpi.compute({
					"indicator": indicators[j].id,
					"sitedata": $scope.params.comparedData[idx] });
				    rowSite[indicators[j].id] = res.value;
				}
				newTableRows.push(rowSite);				
			    }
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
			if(style.json !== undefined &&
			   style.json.dtOptions !== undefined) {
			    //$scope.dtOptions = $q.when(style.json.dtOptions);
			}
		    };
		}],
	    templateUrl: 'build/html/TableKPIView.html'
	};
    });
