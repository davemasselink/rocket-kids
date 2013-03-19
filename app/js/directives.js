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
                scope.$watch(attrs.ngModel, function(value) {
//                    scope.charts[attrs.id].series.setData(value);
                    new Highcharts.Chart({
                        chart: {
                            renderTo: attrs.id,
                            type: attrs.type,
                            height: attrs.height,
                            width: attrs.width,
                            marginRight: attrs.marginright,
                            marginBottom: attrs.marginbottom
                        },
                        title: value.title,
                        subtitle: value.subtitle,
                        xAxis: value.xAxis,
                        yAxis: value.yAxis,
                        tooltip: value.tooltip,
                        legend: value.legend,
                        series: value.series
                    });
                });

            }
        };
    }).
    directive('hichart', function(){
        return{
            restrict: 'E',
            template: '<div></div>',
            link: function(scope, elem, attrs){
                var chart;
                scope.$watch(attrs.ngModel, function(dataSeriesList){
                    if(!chart){
                        chart = new Highcharts.Chart({
                            chart: {
                                renderTo: attrs.id,
                                type: 'line',
                                marginRight: 130,
                                marginBottom: 25
                            },
                            title: {
                                text: 'Monthly Average Temperature',
                                x: -20 //center
                            },
                            subtitle: {
                                text: 'Source: WorldClimate.com',
                                x: -20
                            },
                            xAxis: {
                                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                            },
                            yAxis: {
                                title: {
                                    text: 'Temperature (°C)'
                                },
                                plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#808080'
                                }]
                            },
                            tooltip: {
                                formatter: function() {
                                    return '<b>'+ this.series.name +'</b><br/>'+
                                        this.x +': '+ this.y +'°C';
                                }
                            },
                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'top',
                                x: -10,
                                y: 100,
                                borderWidth: 0
                            },
                            series: dataSeriesList
                        });
                    }else{
                        dataSeriesList.forEach(function(dataSeries, index){
                            chart.series[index].setData(dataSeries.data);
                            chart.series[index].name = dataSeries.name;
                        });
                    }
                });
            }
        };
    });