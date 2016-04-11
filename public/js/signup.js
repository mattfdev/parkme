angular.module("parkmeApp")
.controller('SignupController', ['$scope', '$http', function($scope, $http) {

		$scope.submit = function() {
			
			var user = "";
			var pass = "";
			var pass2 = "";
			var firstname = "";
			var lastname = "";
			var email = "";
			
			if( $scope.username && $scope.password && $scope.password2 && $scope.email ) {
				
				user = $scope.username;
				user = user.toLowerCase();
				pass = $scope.password;
				pass2 = $scope.password2;
				email = $scope.email;
				if( $scope.firstname ){
					
					firstname = $scope.firstname;
				}
				if( $scope.lastname ){
					
					lastname = $scope.lastname;
				}
				
				var match = false;

				$http.get('/userLogin')
					.success( function( res ){

						var users = res.users;
									
						angular.forEach( users, function( value, key ){
							
							if( value.username == user ){
								
								match = true;
							}
						} );

						var validObj = validateSignup( match, pass, pass2, email );

						if( validObj.valid ){
							
							var newUser = { "_id": 0, "username": user, "password": pass, "email": email, "first": firstname, "last": lastname, "spots": [] };
							//id determined during post
							
							$http.post('/userSignup', newUser)
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
		
		function validateSignup( match, password, password2, email ) {

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
			if( password != password2 ){
				
				alert += "\nPasswords do not match.";
				valid = false;
			}

			var atpos = email.indexOf("@");
			var dotpos = email.lastIndexOf(".");
			
			if ( atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length ) {

				alert += "\nNot a valid email.";
				valid = false;
			}
			
			return {"valid": valid, "alert": alert};
		}
}]);

