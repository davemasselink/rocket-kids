'use strict';

/* Services */

angular.module('rocketKids.services', []).
    value('version', '0.1').
    factory('Student', function($mongolabResource) {
        return $mongolabResource('students');
    });
