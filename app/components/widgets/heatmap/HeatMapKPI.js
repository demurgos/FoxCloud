/**
 * @class GraphKPI
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying a KPI value from a specific indicator
 **/

require('../../services/WidgetStyleService');

import { HeatMapRenderer } from './HeatMapRenderer';

angular.module('FSCounterAggregatorApp').
    directive('fcaHeatMapKpi', function () {
        return {
            scope: {
                params: '=',
                kpi: '=',
                kpiOptions: '=?'
            },
            controller: [
                '$scope',
                'WidgetStyleService',
                function (
                    $scope,
                    WidgetStyleService
                ) {
                }],
            link: function (scope, elm, attr) {
                var elts = angular.element(elm).find("#heatmap-renderer");
                scope.domRenderer = elts[0];
                scope.renderer = new HeatMapRenderer(scope.domRenderer, {});                
                requestAnimationFrame(animate);

                function animate() {
                    scope.$evalAsync(function () {      
                        requestAnimationFrame(animate);                  
                        scope.renderer.onSurfaceChanged();
                        scope.renderer.onDrawFrame();
                    });                    
                }
            },
            templateUrl: 'build/html/HeatMapKPIView.html'
        };
    });

