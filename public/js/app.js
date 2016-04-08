angular.module("contactsApp", ['ngRoute'])
.config(function($routeProvider) {
    $routeProvider
	.when("/", {
	    templateUrl: "list.html",
	    controller: "ListController"
	})
	.when("/login", {
		
		templateUrl: "login.html",
		controller: "SubmitController"
	})
})
.controller('SubmitController', ['$scope', '$http', function($scope, $http) {

		$scope.submit = function() {
			
			var user = "";
			var pass = "";
			
			if( $scope.username && $scope.password ) {
				
				user = $scope.username;
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
}]);