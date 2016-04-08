angular.module("contactsApp", ['ngRoute'])
.config(function($routeProvider) {
    $routeProvider
	.when("/", {
	    templateUrl: "map.html",
	    controller: "MapController"
	})
	.when("/login", {
		
		templateUrl: "login.html",
		controller: "LoginController"
	})
	.when("/signup", {
		
		templateUrl: "signup.html",
		controller: "SignupController"
	})
})
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
.controller('LoginController', ['$scope', '$http', function($scope, $http) {

		$scope.submit = function() {
			
			var user = "";
			var pass = "";
			
			if( $scope.username && $scope.password ) {
				
				user = $scope.username;
				user = user.toLowerCase();
				pass = $scope.password;
				
				$http.get('/user-login')
					.success( function( res ){
						
						var users = res.users;
						var match = false;
						
						angular.forEach( users, function( value, key ){
							
							if( value.username == user && value.password == pass ){
								
								match = true;
							}
						} );
						
						if( match ){
							
							sessionStorage.setItem( "username", user );
							window.location.href = "#/";
							location.reload();
						}
						else{
							
							alert( "Username and password do not match." );
						}
						
					} )
					.error( function( res ){
						
						alert( "Error searching for user." );
					});
					
				
			}
			else{
				
				alert( "Please fill out both fields." );
			}	
	
		};
}])
.controller('SignupController', ['$scope', '$http', function($scope, $http) {

		$scope.submit = function() {
			
			var user = "";
			var pass = "";
			var firstname = "";
			var lastname = "";
			var email = "";
			
			if( $scope.username && $scope.password && $scope.email ) {
				
				user = $scope.username;
				user = user.toLowerCase();
				pass = $scope.password;
				email = $scope.email;
				if( $scope.firstname ){
					
					firstname = $scope.firstname;
				}
				if( $scope.lastname ){
					
					lastname = $scope.lastname;
				}
				
				var match = false;

				$http.get('/user-login')
					.success( function( res ){

						var users = res.users;
									
						angular.forEach( users, function( value, key ){
							
							if( value.username == user ){
								
								match = true;
							}
						} );

						if( match ){
							
							alert( "Username already exists." );
						}
						else{
							
							var newUser = { "_id": 0, "username": user, "password": pass, "email": email, "first": firstname, "last": lastname, rentals: [] };
							//id determined during post
							
							$http.post('/user-signup', newUser)
								.success( function( response ){
									
									console.log( "New user signed up: " + user );
									alert( "Signed up successfully! Redirecting to Login page." );
									window.location.href = "#/login";
									location.reload();
								} )
								.error( function( ressponse ){
									
									alert( "Error signing up. Consult admin/developer." );
								});
						}
					} )
					.error( function( res ){
						
						alert( "Error searching for user." );
					});
					
			}
			else{
				
				alert( "Please fill out required fields." );
			}	
	
		};
}]);