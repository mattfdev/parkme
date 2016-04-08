angular.module("contactsApp", ['ngRoute'])
.config(function($routeProvider) {
    $routeProvider
	.when("/", {
	    templateUrl: "list.html",
	    controller: "ListController"
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