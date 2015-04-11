angular.module('publicApp')
  .service('geolocation', function () {
    var ids =0;

    function getNewId(){
      return ++ids;
    }

    function getError(cbk) {
      return function error(msg) {
        cbk(new Error(msg))
      }
    }

    function getSuccess(cbk){
      return function success(data) {
        if (!data || !data.coords)
          return error("missing data");
        var pos = {
          id: getNewId(),
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          accuracy: data.coords.accuracy
        };
        cbk(null, pos);
      }
    }

    this.getCurrentLocation = function(cbk){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getSuccess(cbk), getError(cbk));
      } else {
        getError(cbk)('not supported');
      }
    };

    this.watchCurrentLocation = function(cbk){
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(getSuccess(cbk), getError(cbk));
      } else {
        getError(cbk)('not supported');
      }
    };

  });
