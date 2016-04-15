angular.module("parkmeApp")
.filter('notTaken', function()
{
	return function(orig_list)
	{
		var return_list = undefined;

		if (orig_list)
		{
			var num_spots = orig_list.length;
			var filtered_list = [];
			var i, spot;

			for (i = 0; i < num_spots; i++)
			{
				spot = orig_list[i];
				if (spot.tenant === 0)
				{
					filtered_list.push(spot);
				}
			}
			return_list = filtered_list;
		}
		return return_list;
	};
})
.filter('proximity', function()
{
	return function(orig_list, dist)
	{
		var return_list = undefined;

		if (orig_list)
		{
			if (dist != 0)
			{
				var num_spots = orig_list.length;
				var filtered_list = [];
				var i, spot;

				for (i = 0; i < num_spots; i++)
				{
					spot = orig_list[i];
					if (spot.distance < dist)
					{
						filtered_list.push(spot);
					}
				}
				return_list = filtered_list;
			}
			else
			{
				return_list = orig_list;
			}
		}
		return return_list;
	};
})
.filter('pricings', function()
{
	return function(orig_list, pref)
	{
		var return_list = undefined;

		if (orig_list && pref)
		{
			var num_spots = orig_list.length;
			var filtered_list = [];
			var i, spot;

			for (i = 0; i < num_spots; i++)
			{
				spot = orig_list[i];
				var valid = true;
				if( pref.maxHour ){

					if( pref.maxHour < spot.price_hour ) valid = false;
				}
				if( pref.maxDay ){

					if( pref.maxDay < spot.price_day ) valid = false;
				}
				if( pref.maxMonth ){

					if( pref.maxMonth < spot.price_month ) valid = false;
				}
				if( valid ){

					filtered_list.push(spot);
				}
			}
			return_list = filtered_list;
		}
		return return_list;
	};
})
.controller('MapController', ['$scope', '$http','$filter', function($scope, $http, $filter) {

    var geocoder = new google.maps.Geocoder;
    var map = null, mapMarkers = [];
	$scope.available = true;
    $scope.makerInfoArray = [];
    $scope.max_distance = 5;
	$scope.parkingSpots = [];
	$scope.filteredSpots = [];
	$scope.maxDistance = 10;
	$scope.priceHour = 0;
	$scope.priceDay = 0;
	$scope.priceMonth = 0;

	var input = document.getElementById('destination');
	var autocomplete = new google.maps.places.Autocomplete(input);
	google.maps.event.addListener(autocomplete, 'autocompleted', updatePosition);

    //geolocation button
    document.getElementById("geolocate").onclick = function(){

        var geoSuccess = function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            $scope.searchPosition = {lat: lat, lng: lng};
            mapCoordinates({lat,lng});
        };
        var geoError = function(error) {
            console.log('Error occurred. Error code: ' + error.code);
        };
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    };

    // Retrieve list of all parking spots:
	$http.get("/parkingSpots").then(
		function success(response)
		{
			$scope.parkingSpots = response.data.location;
			//console.log($scope.parkingSpots);
			$scope.updateSpotDistances();
		},
		function error(response)
		{
			console.log(response);
			//alert("Unable to load parking spots!");
		});

	$scope.updateSpotDistances = function()
		{
			if ($scope.parkingSpots && $scope.searchPosition)
			{
				var num_spots = $scope.parkingSpots.length;
				var i, spot, spotPosition;

				for (i = 0; i < num_spots; i++)
				{
					spot = $scope.parkingSpots[i];
					spotPosition = {lat:spot.lat, lng:spot.lon};
					spot.distance = calcDistance($scope.searchPosition, spotPosition);
                    //console.log(spot.distance + "km away from location");
				}
				$scope.$digest();

				filterOptions();
			}
		}

        // Helper functions below.
	function calcDistance(current, target)
		{
			var radius = 6371; // Earth's radius, 6371 km.
			var lat1 = toRads(current.lat);
			var lng1 = toRads(current.lng);
			var lat2 = toRads(target.lat);
			var lng2 = toRads(target.lng);
			var d = 2 * radius *
				Math.asin(Math.sqrt(
					Math.pow(Math.sin( (lat2 - lat1) / 2), 2) +
					Math.cos(lat1) * Math.cos(lat2) *
					Math.pow(Math.sin( (lng2 - lng1) / 2), 2)
				));
			return roundToTwoDec(d);
		}

	function toRads(degree)
		{
			return degree * (Math.PI / 180);
		}

	function roundToTwoDec(num)
		{
			return Math.round(num * 100) / 100;
		}

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
        $scope.updateSpotDistances();
    }

	$scope.updateFilters = function()
	{
		filterOptions();
	}

	//Use specified filters and module filters to filter. Filter.
	function filterOptions(){

		var num_spots = $scope.parkingSpots.length;
		var i, spot, spotPosition;

		var maxDist = 10;
		if( $scope.maxDistance )
		{
			maxDist = $scope.maxDistance;
		}

		$scope.filteredSpots = $filter( "proximity" )( $scope.parkingSpots, maxDist );
		if( $scope.available )
		{
			$scope.filteredSpots = $filter( "notTaken" )( $scope.filteredSpots );
		}
		if( $scope.prices )
		{
			$scope.filteredSpots = $filter( "pricings" )( $scope.filteredSpots, $scope.prices );
		}

		clearMarkers();
		placeMarkers();
	}

	function clearMarkers()
	{
		for (var i = 0; i < mapMarkers.length; i++)
		{
			mapMarkers[i].setMap(null);
        }
    }

	//Places markers for filtered list
	function placeMarkers()
	{
		mapMarkers = [];
		var spot,spotPosition;
		num_spots = $scope.filteredSpots.length;
		for (var i = 0; i < num_spots; i++)
		{
			spot = $scope.filteredSpots[i];
			spotPosition = {lat:spot.lat, lng:spot.lon};

			var image = "http://backpackingconnecticut.com/images/parking.png";
			var marker=new google.maps.Marker({
				position: spotPosition,
				icon: image
			});
            var contentString = '<div id="content">'+ '<h3 class="address"> Address:<a href="https://maps.google.com/?q='+spot.address +'">'+ spot.address+'</a> </h3>'+
            '<h5 class="parkingType"> Parking Type: '+ spot.parking_type + '</h5>'+
            '<h5 class="landlordInfo"> Contact the user '+ spot.username +' at <a href="mailto:'+spot.email+'">'+spot.email+'</a>' + ' for rental'+ '</h5>'+
            '<p class="parkingInfo"> Additonal Info: '+ spot.info + '</p>'+
            '<p class="parkingPricing"> This spot costs <strong> $'+spot.price_hour+' an hour </strong>'+
            'or is available at a discounted rate of <strong> $' + spot.price_day + ' a day or $' + spot.price_month +
            ' a month </strong> </p> </div>';
            var infowindow = new google.maps.InfoWindow();
			bindInfoWindow(marker, map, infowindow, contentString);
			marker.setMap(map);
			mapMarkers.push(marker);
		}
	}

	function bindInfoWindow(marker, map, infowindow, html) {

		marker.addListener('click', function() {
			infowindow.setContent(html);
			infowindow.open(map, this);
		});
	}

	function updatePosition(){
		// Extract the address components from the Google place result.
		var place = autocomplete.getPlace();
		if (place){
			$scope.searchPosition = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
			mapCoordinates(place.geometry.location);
		}
	}

    $scope.submit = function(){

        var address = input.value;
        function codeAddress() {
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var currentLoc = results[0].geometry.location;
                $scope.searchPosition = {lat: currentLoc.lat(), lng: currentLoc.lng()}
                mapCoordinates(currentLoc);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
        }
        codeAddress();
    }

	//Post Parking Spot button
    document.getElementById( "postspot" ).onclick = function()
	{
		if( sessionStorage.getItem( "user._id" ) == null )
		{
			alert( "Please login before posting." );
			window.location.href = "#/login";
			location.reload();
		}
		else
		{
			var postbox = document.getElementById( "postbox" );
			var dimmer = document.getElementById( "dimmer" );
			dimmer.style.display = 'block';
			postbox.style.display = 'block';

			dimmer.onclick = function()
			{
				dimmer.style.display = 'none';
				postbox.style.display = 'none';
			}
			return false;
		}
	}
}])
