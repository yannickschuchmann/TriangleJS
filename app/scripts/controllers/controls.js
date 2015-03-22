'use strict';

/**
 * @ngdoc function
 * @name triangleJsApp.controller:ControlsCtrl
 * @description
 * # ControlsCtrl
 * Controller of the triangleJsApp
 */
angular.module('triangleJsApp')
  .controller('ControlsCtrl', function ($scope, $rootScope, verticesService, settingsService) {
    $scope.randomAmount = 50;
    $scope.settings = settingsService.get();


    $scope.export = function() {
      $rootScope.$broadcast('export');
    };
    $scope.clear = function() {
      verticesService.removeAllVertices();
      $rootScope.$broadcast('render');
    };
    $scope.undo = function() {
      verticesService.removeLastVertex();
      $rootScope.$broadcast('render');
    };

    $scope.addRandom = function() {
      var w = settingsService.get('width'), h = settingsService.get('height');
      for (let i = 0; i < this.randomAmount; i++) {
        let vertex = [~~(Math.random() * w), ~~(Math.random() * h)];
        verticesService.addVertex(vertex);
      }
      $rootScope.$broadcast('render');
    };

    $scope.updateSettings = function() {
      settingsService.set($scope.settings);
    }
  });
