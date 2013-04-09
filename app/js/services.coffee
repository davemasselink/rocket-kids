#Services
module = angular.module 'rocketKids.services', []

module.value 'version', '0.1'

module.factory 'Student', ($mongolabResource) ->
    $mongolabResource 'students'

module.factory 'Ethnicity', ($mongolabResource) ->
    $mongolabResource 'ethnicities'

module.factory 'DailyComm', ($mongolabResource) ->
    $mongolabResource 'daily-communications'
