'use strict';

/**
 * @ngdoc function
 * @name todoappApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the todoappApp
 */
//angular.module('todoappApp')
  app.controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
