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
	
.controller('SearchController', ['$scope', '$http', '$filter', function($scope, $http) 
{
	// Initialize:
	getCurrentLocation();
	$scope.max_distance = 0;
	$scope.parkingSpots = [];
	
	// Google Location Search:
	var input = document.getElementById('location_search');
	var options = { types: ['(cities)'] };
	var autocomplete = new google.maps.places.Autocomplete(input, options);
	google.maps.event.addListener(autocomplete, 'place_changed', update_search_position); 

	function update_search_position()
		{
			// Extract the address components from the Google place result.
			var place = autocomplete.getPlace();
			if (place)
			{
				$scope.searchPosition = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
				$scope.updateSpotDistances();
			}
		}
		
	// Retrieve list of all parking spots:
	$http.get("/parkingSpots").then(
		function success(response) 
		{
			$scope.parkingSpots = response.data.location;
			console.log($scope.parkingSpots);
			$scope.updateSpotDistances();
		}, 
		function error(response) 
		{
			console.log(response);
			alert("Unable to load parking spots!");
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
				}
				$scope.$digest();
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
		
	function getCurrentLocation()
		{
			if (navigator.geolocation)
			{
				var geoLocationOptions = 
				{
					enableHighAccuracy: false,
					timeout: 5000,
					maximumAge: 0
				};
				navigator.geolocation.getCurrentPosition(geoSuccess, geoFail, geoLocationOptions);
			} 
			else 
			{
				alert("Geolocation not supported! Try a good browser!");
			}
		}

	function geoSuccess(position)
		{
			// Create a new google map centered on user's current position.
			$scope.searchPosition = {lat: position.coords.latitude, lng: position.coords.longitude};
			$scope.updateSpotDistances();
		}

	function geoFail(error)
		{
			console.log("Geolocation failed: " + error.message);
		}
}]);

