angular.module("parkmeApp")
.controller('PostSpotController', ['$scope', '$http', function($scope, $http) {

	var geocoder = new google.maps.Geocoder;
	var input = document.getElementById('location');
	var autocomplete = new google.maps.places.Autocomplete(input);
	
	var priceHour = document.getElementById('priceHour');
	var priceDay = document.getElementById('priceDay');
	var priceMonth = document.getElementById('priceMonth');
	
	priceHour.onchange = setTwoNumberDecimal;
	priceDay.onchange = setTwoNumberDecimal;
	priceMonth.onchange = setTwoNumberDecimal;

	$scope.submit = function() {
	
		/* TODO */
		var address = input.value;
        geocoder.geocode( { 'address': address }, function( results, status ) {
            if (status === google.maps.GeocoderStatus.OK) {
				
                postParkingSpot(results[0].geometry.location);
            } else {
				
				var msg = "Geocode was not successful for the following reason: " + status;
				msg += "\nPlease input a valid location or try again later.";
                alert( msg );
            }
        });
    }
	
	function postParkingSpot( location ){
		
		var id = 0;
		var lat = location.lat();
		var lng = location.lng();
		var landlord = parseInt( sessionStorage.getItem( "user._id" ) );
		var tenant = 0;
		var hour = 0.00;
		var day = 0.00;
		var month = 0.00;
		var type = "";
		var info = "";
		
		if( $scope.priceHour ){
			
			hour = $scope.priceHour;
		}
		if( $scope.priceDay ){
			
			day = $scope.priceDay;
		}
		if( $scope.priceMonth ){
			
			month = $scope.priceMonth;
		}
		if( $scope.info ){
			
			info = $scope.info;
		}
		
		if( $scope.type ){
			
			type = $scope.type;
			var newSpot = { "_id": id, "lat": lat, "lon": lng, "landlord": landlord, "tenant": tenant,
							"price_hour": hour, "price_day": day, "price_month": month, 
							"parking_type": type, "info": info };
			addSpotToDB( newSpot );
		}
		else{
			
			alert( "Please choose a parking type." );
		}
		
	}
	
	function addSpotToDB( newSpot ){
		
		$http.post( '/postParkingSpot', newSpot )
			.success( function( response ){
				
				console.log( "New spot posted: " + response._id );
				alert( "New parking spot added successfully! Reloading Page." );
				window.location.href = "#/search";
				location.reload();
			} )
			.error( function( response ){
				
				alert( "Error posting parking spot. Consult admin/developer." );
			});
	}
	
	function reload() {
		
		window.location.href = "#/search";
	}
	
	function setTwoNumberDecimal(event) {
		this.value = parseFloat(this.value).toFixed(2);
	}
}])