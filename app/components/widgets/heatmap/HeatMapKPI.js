/**
 * @class GraphKPI
 * @memberof FSCounterAggregatorApp
 * @description Widget implementation for displaying a KPI value from a specific indicator
 **/

import { TextureLoader } from 'three';

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
                'DataService',
                function (
                    $scope,
                    WidgetStyleService,
                    DataService
                ) {
                    $scope.widgetId = "HeatMapKPIWidget";
                    $scope.siteSelected = undefined;

                    $scope.$watch("params.sites", function (newSites, oldSites) {
                        if (newSites !== undefined && newSites.length) {
                            $scope.siteSelected = $scope.params.sites[0];
                        }
                    });

                    $scope.periodComparisonSelected = false;
                    $scope.heatmapVisible = 0;

                    $scope.style = undefined;

                    $scope.$watch('params.data', function (newData, oldData) {
                        if (newData !== undefined && newData.length) {
                            $scope.update();
                        }
                    });

                    $scope.$watch('params.comparedData', function (newData, oldData) {
                        if (newData !== undefined && newData.length) {
                            $scope.periodComparisonSelected = true;                            
                        } else if ($scope.periodComparisonSelected) {
                            $scope.periodComparisonSelected = false;
                            $scope.heatmapVisible = 0;
                            $scope.update();
                        }                        
                    });

                    $scope.$watch('heatmapVisible', function (newV, oldV) {
                        if (oldV !== newV) {                            
                            $scope.renderer.setHeatMapVisible(0, newV === 0);
                            $scope.renderer.setHeatMapVisible(1, newV === 1);                            
                        }
                    });

                    $scope.siteSelectedChanged = () => {
                        $scope.renderer.resetControls();
                        $scope.update();
                    };

                    $scope.update = function () {                        

                        $scope.renderer.removeAllHeatMap();

                        if (!$scope.siteSelected || !$scope.siteSelected.siteInfo || !$scope.siteSelected.siteInfo.heatmap) {
                            return false;
                        }

                        new TextureLoader().load($scope.siteSelected.siteInfo.heatmap.map,
                            (texture) => {

                                $scope.renderer.setViewport(texture.image.width, texture.image.height, texture);

                                DataService.getFakeHeatMapData($scope.siteSelected.siteInfo.heatmap)
                                    .then((data) => {

                                        // randomize data
                                        data = data.map(elt => elt.map(e => e + 0.2 * e * Math.random()));

                                        $scope.renderer.addHeatMap(data, 255);
                                        $scope.renderer.setHeatMapVisible(0, $scope.heatmapVisible === 0);

                                        if ($scope.periodComparisonSelected) {

                                            let compData = data.map((elt) => {
                                                return elt.map(e => e + 0.2 * e * Math.random());
                                            });

                                            $scope.renderer.addHeatMap(compData, 255);                                            
                                            $scope.renderer.setHeatMapVisible(1, $scope.heatmapVisible === 1);

                                            /*new TextureLoader().load('assets/img/deep-sea-gradient.png',
                                                (texture) => {
                                                    $scope.renderer.addHeatMap(compData, 255, texture);
                                                    $scope.renderer.setHeatMapVisible(1, $scope.heatmapVisible === 1);                                                
                                                });*/
                                        }
                                    });
                            });
                    };

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
            templateUrl: 'build/html/heatmap/HeatMapKPIView.html'
        };
    });

