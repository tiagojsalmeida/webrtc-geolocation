'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:RoomCtrl
 * @description
 * # RoomCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
  .controller('RoomCtrl', function ($sce, VideoStream, $location, $routeParams, $scope, Room, geolocation) {

    if (!window.RTCPeerConnection || !navigator.getUserMedia) {
      $scope.error = 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.';
      return;
    }

    var stream;

    VideoStream.get()
    .then(function (s) {
      stream = s;
      Room.init(stream);
      stream = URL.createObjectURL(stream);
      if (!$routeParams.roomId) {
        Room.createRoom()
        .then(function (roomId) {
          $location.path('/room/' + roomId);
        });
      } else {
        Room.joinRoom($routeParams.roomId);
      }
    }, function () {
      $scope.error = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
    });
    $scope.peers = [];
    Room.on('peer.stream', function (peer) {
      console.log('Client connected, adding new stream');
      $scope.peers.push({
        id: peer.id,
        stream: URL.createObjectURL(peer.stream)
      });
    });
    Room.on('peer.disconnected', function (peer) {
      console.log('Client disconnected, removing stream');
      $scope.peers = $scope.peers.filter(function (p) {
        return p.id !== peer.id;
      });
    });


    $scope.locations = [];

    $scope.map = {
      center: {
        longitude:40,
        latitude:0
      },
      zoom: 4,
      bounds: {}
    };

    $scope.options = {
      scollWheel:false
    };

    $scope.getLocalVideo = function () {
      return $sce.trustAsResourceUrl(stream);
    };

    $scope.getCurrentLocation = function(){
      geolocation.getCurrentLocation(function(err,location){
        if(err){
          return console.log('error getting position'+err);
        }
        $scope.locations[0] = location;
        $scope.myLocation = location.latitude+' '+location.longitude;
      });
    };

    geolocation.watchCurrentLocation(function(err,location){
      if(err){
        return console.log('error getting position'+err);
      }
      $scope.locations[0] = location;
      $scope.myLocation = location.latitude+' '+location.longitude;
    });


  });
