angular.module("parkmeApp")
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

						var validObj = validateSignup( match, pass );

						if( validObj.valid ){
							
							var newUser = { "_id": 0, "username": user, "password": pass, "email": email, "first": firstname, "last": lastname, rentals: [] };
							//id determined during post
							
							$http.post('/user-signup', newUser)
								.success( function( response ){
									
									console.log( "New user signed up: " + user );
									alert( "Signed up successfully! Redirecting to Login page." );
									window.location.href = "#/login";
									location.reload();
								} )
								.error( function( response ){
									
									alert( "Error signing up. Consult admin/developer." );
								});
						}
						else{
							
							alert( validObj.alert );
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

function validateSignup( match, password ) {

	var valid = true;
	var alert = "";
	
	if( match ){
		
		alert += "Username already exists.";
		valid = false;
	}
	if( password.length < 6 || password.length > 20 ){
		
		alert += "\nPassword not between 6 and 20 characters.";
		valid = false;
	}
	
	return {"valid": valid, "alert": alert};
}