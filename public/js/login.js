angular.module("parkmeApp")
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
						var id = 0;
						
						angular.forEach( users, function( value, key ){
							
							if( value.username == user && value.password == pass ){
								
								match = true;
								id = value._id;
							}
						} );
						
						if( match ){
							
							alert( "Login successful! Redirecting to Home page." );
							
							sessionStorage.setItem( "username", user );
							sessionStorage.setItem( "user._id", id );
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
