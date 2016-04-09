angular.module("parkmeApp")
.controller('MapController', ['$scope', '$http', function($scope, $http) {
    var geocoder = new google.maps.Geocoder;
    //geolocation button
    document.getElementById("geolocate").onclick = function(){
        var geoSuccess = function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            mapCoordinates({lat,lng});
        };
        var geoError = function(error) {
            console.log('Error occurred. Error code: ' + error.code);
        };
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    };
    
    function mapCoordinates(postition) {
        function initialize() {
        var mapProp = {
            center:postition,
            zoom:15,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };
        var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    
        var marker=new google.maps.Marker({
            position:postition,
        });

        marker.setMap(map);
    }
    initialize();
    }
    
    $scope.submit = function(){
        var address = $scope.destination;
        function codeAddress() {
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                mapCoordinates(results[0].geometry.location);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
        }
        codeAddress();
    }
    
    
}])