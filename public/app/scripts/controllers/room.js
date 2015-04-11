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

        if (!window.RTCPeerConnection || !navigator.geolocation) {
            $scope.error = 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.';
            return;
        }

        var stream;

        navigator.geolocation.getCurrentPosition(function (s) {
            stream = s;
            Room.init(stream);
//                stream = URL.createObjectURL(stream);
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
            peer.location.coords.id = peer.id;
            $scope.peers.push(peer.location.coords);
            $scope.map.center = peer.location.coords;
        });
        Room.on('peer.disconnected', function (peer) {
            console.log('Client disconnected, removing stream');
            $scope.peers = $scope.peers.filter(function (p) {
                return p.id !== peer.id;
            });
        });

//        $scope.getLocalVideo = function () {
//            return $sce.trustAsResourceUrl(stream);
//        };

        $scope.getLocation = function () {
            return stream;
        };


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

//        $scope.getCurrentLocation = function(){
//            geolocation.getCurrentLocation(function(err,location){
//                if(err){
//                    return console.log('error getting position'+err);
//                }
//                $scope.peers[0] = location;
//                $scope.myLocation = location.latitude+' '+location.longitude;
//            });
//        };

        geolocation.watchCurrentLocation(function(err,location){
            if(err){
                return console.log('error getting position'+err);
            }
            //add ID
            $scope.peers[0] = location;
            $scope.myLocation = location.latitude+' '+location.longitude;
        });


    });
