'use strict';

/* Directives */


angular.module('rocketKids.directives', []).
    directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }]).
    directive('highchart', function () {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div></div>',

            replace: true,
            link: function (scope, element, attrs) {
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: attrs.id,
                        type: attrs.type,
                        height: attrs.height,
                        width: attrs.width,
                        marginRight: attrs.marginright,
                        marginBottom: attrs.marginbottom
                    },
                    title: scope.charts[attrs.id].title,
                    subtitle: scope.charts[attrs.id].subtitle,
                    xAxis: scope.charts[attrs.id].xAxis,
                    yAxis: scope.charts[attrs.id].yAxis,
                    tooltip: scope.charts[attrs.id].tooltip,
                    legend: scope.charts[attrs.id].legend,
                    series: scope.charts[attrs.id].series
                });
            }
        };
    });