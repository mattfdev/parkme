angular.module("parkmeApp")
.controller('MapController', ['$scope', '$http', function($scope, $http) {
    var geocoder = new google.maps.Geocoder;
    var map;
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
            zoom:16,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        };
        map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    
        var marker=new google.maps.Marker({
            position:postition,
        });

        marker.setMap(map);
        }
        initialize();
    }
    
    var input = document.getElementById('destination');
	var autocomplete = new google.maps.places.Autocomplete(input);
	google.maps.event.addListener(autocomplete, 'autocompleted', updatePosition); 

	function updatePosition(){
			// Extract the address components from the Google place result.
			var place = autocomplete.getPlace();
			if (place){
				mapCoordinates(place.geometry.location);
			}
		}
    
    $scope.submit = function(){
        var address = input.value;
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
    
	//Post Parking Spot button
    document.getElementById( "postspot" ).onclick = function(){

		if( sessionStorage.getItem( "user._id" ) == null ){
			
			alert( "Please login before posting." )
			window.location.href = "#/login";
			location.reload();
		}
		else{
			
			var postbox = document.getElementById( "postbox" ),
				dimmer = document.createElement( "div" );

			dimmer.style.width =  "100%";
			dimmer.style.height = "100%";
			dimmer.className = 'dimmer';

			dimmer.onclick = function(){
				document.body.removeChild( this );   
				postbox.style.visibility = 'hidden';
			}

			document.body.appendChild( dimmer );

			postbox.style.visibility = 'visible';
			postbox.style.top = "10%";
			postbox.style.left = "30%";
			return false;
		}
	}
}])