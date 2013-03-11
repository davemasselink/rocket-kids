'use strict';


// Declare app level module which depends on filters, and services
angular.module('rocketKids', ['rocketKids.filters', 'rocketKids.services',
        'rocketKids.directives', 'mongolabResource', 'ui', 'ui.bootstrap']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/list', {templateUrl: 'partials/list.html'});
        $routeProvider.when('/add', {templateUrl: 'partials/add.html', controller: AddCtrl});
        $routeProvider.when('/data', {templateUrl: 'partials/data.html', controller: DataCtrl});
        $routeProvider.otherwise({redirectTo: '/list'});
    }]).
  constant('API_KEY', '4A-uP0EZnVlYAT3oD42ZA-GdEet_3MSA').
  constant('DB_NAME', 'rocketkids');