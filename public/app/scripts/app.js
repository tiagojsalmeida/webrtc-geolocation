'use strict';

/**
 * @ngdoc overview
 * @name publicApp
 * @description
 * # publicApp
 *
 * Main module of the application.
 */

angular
  .module('publicApp', [
    'ngRoute','classy','uiGmapgoogle-maps'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/room/:roomId', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl'
      })
      .when('/room', {
        templateUrl: 'views/room.html',
        controller: 'RoomCtrl'
      })
      .otherwise({
        redirectTo: '/room'
      });
  }).config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    china: true,
    key: 'AIzaSyBVIdFfW8q4AfMFtwu-BQM9ukQopHnpe9c',
    // v: '3.17',
    libraries: 'weather,geometry,visualization'
  });
});

angular.module('publicApp')
  .constant('config', {
      SIGNALIG_SERVER_URL: undefined
  });

Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
  obj.prototype = proto;
  return obj;
};
