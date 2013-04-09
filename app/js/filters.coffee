#Filters
module = angular.module 'rocketKids.filters', []

module.filter 'interpolate', ['version', (version) ->
  (text) ->
    String(text).replace /\%VERSION\%/mg, version
]
