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
                function (
                    $scope,
                    WidgetStyleService
                ) {
                    $scope.widgetId = "HeatMapKPIWidget";
                    $scope.siteSelected = undefined;

                    $scope.$watch("params.sites", function (newSites, oldSites) {
                        if (newSites !== undefined && newSites.length) {
                            $scope.siteSelected = $scope.params.sites[0];
                        }
                    });

                    $scope.periodComparisonSelected = false;

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
                        }
                        $scope.update();
                    });

                    $scope.update = function () {

                        $scope.renderer.removeAllHeatMap();

                        $scope.renderer.setBackground(new TextureLoader().load('assets/img/uv.png'));

                        let data = [];

                        for (var i = 0; i < 500; ++i) {
                            data.push([1000 * Math.random() - 500,
                            200 * Math.random() - 100,
                            100 * Math.random(),
                            255 * Math.random()]);
                        }

                        $scope.renderer.addHeatMap(data, 255);

                        if ($scope.periodComparisonSelected) {
                            let data = [];

                            for (var i = 0; i < 500; ++i) {
                                data.push([1000 * Math.random() - 500,
                                200 * Math.random() - 100,
                                100 * Math.random(),
                                255 * Math.random()]);
                            }

                            new TextureLoader().load('assets/img/deep-sea-gradient.png',
                                (texture) => {
                                    $scope.renderer.addHeatMap(data, 255, texture);
                                });
                        }
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

