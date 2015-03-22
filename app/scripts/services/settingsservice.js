'use strict';

/**
 * @ngdoc service
 * @name triangleJsApp.settingsService
 * @description
 * # settingsService
 * Service in the triangleJsApp.
 */
angular.module('triangleJsApp')
  .service('settingsService', function ($rootScope) {
    this._settings = {
      colorRange: 6
    };
    this.get = function(prop) {
      return prop ? this._settings[prop] : this._settings;
    };
    this.set = function(value) {
      angular.extend(this._settings, value);
      value.colorRange = parseInt(value.colorRange);
    };
  });
