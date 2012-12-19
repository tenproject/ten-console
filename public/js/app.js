var TEN = {};
var App = angular.module('TEN', []);

App.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'templates/home',
      controller: HomeCtrl
    }).
    when('/console', {
      templateUrl: 'templates/console',
      controller: ConsoleCtrl
    }).
    when('/api', {
      templateUrl: 'templates/api'
    }).
    otherwise({
      templateUrl: 'templates/404'
    });

  $locationProvider.html5Mode(true);
}]);
