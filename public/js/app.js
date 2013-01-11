var TEN = {};
var App = angular.module('TEN', []);

function ConsoleCtrl($scope, $routeParams) {
  $scope.name = "ConsoleCtrl";
  $scope.params = $routeParams;

  $scope.username = 'Anon';

  $scope.sayHello = function() {
    $scope.greeting = 'Hello ' + $scope.username + '!';
  };

  $scope.sayHello();

  console.log($scope.params);
}

App.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'templates/home'
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
