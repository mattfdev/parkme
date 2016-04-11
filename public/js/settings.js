angular.module("parkmeApp")
.controller('CheckSettingsController', ['$scope', '$http', function($scope, $http) 
{

	var username = sessionStorage.getItem("username");
	var user_id = parseInt(sessionStorage.getItem("user._id"));
	var email = "";
	var first_name = "";
	var last_name = "";
	var user = "";
	var rentals = [];
	$scope.users = [];
	$scope.spots = [];
	$scope.allSpots = [];
	
	$http.get("/accountInfo").then(
	function success(response)
	{
		$scope.users = response.data.users;
		console.log($scope.users);
		$scope.printInformation();
		
		$http.get("/parkingSpots").then(
			function success(response)
			{
				$scope.allSpots = response.data.location;
				console.log($scope.allSpots);
				$scope.filterUserSpots();
			},
			function error(response)
			{
				console.log(response);
				alert("Unable to check spots!");
			});
	},
	function error(response)
	{
		console.log(response);
		alert("Unable to check users!");
	});
	
	$scope.printInformation = function()
	{
		if($scope.users)
		{
			user = $scope.users[user_id - 1];
			email = user.email;
			first_name = user.first;
			last_name = user.last;
			document.getElementById("username").innerHTML = username;
			document.getElementById("email").innerHTML = email;
			document.getElementById("first").innerHTML = first_name;
			document.getElementById("last").innerHTML = last_name;
			
		}
	}
	
	$scope.filterUserSpots = function()
	{
		if($scope.spots)
		{
			var userSpots = $scope.users[user_id - 1].spots;
			var numSpots = userSpots.length;
			var spotsOutput = "";
			for( var i = 0; i < numSpots; i++ ){
				
				var spot = $scope.allSpots[ userSpots[i] - 1 ];
				$scope.spots.push( spot );
			}
		}		
	}
	
	$scope.showPassword = function()
	{
		document.getElementById("changePasswordField").style.display = 'block';
		document.getElementById("showPassword").style.display = 'none';
		document.getElementById("changeEmailField").style.display = 'none';
		document.getElementById("showEmail").style.display = 'block';
	}
	
	$scope.showEmail = function()
	{
		document.getElementById("changeEmailField").style.display = 'block';
		document.getElementById("showEmail").style.display = 'none';
		document.getElementById("changePasswordField").style.display = 'none';
		document.getElementById("showPassword").style.display = 'block';
	}
	
	$scope.changePassword = function()
	{
		
		var validObj = validateSignup($scope.newPass, $scope.newPass2);
		
		
		if($scope.currentPass && $scope.newPass && $scope.newPass2)
		{
			var currentPassword = user.password;
			if(($scope.currentPass == currentPassword) && (validObj.valid) && ($scope.newPass == $scope.newPass2))
			{
				rentals = user.spots;
				var replace_user = {"_id": user_id, "username": username, "password": $scope.newPass, "email": email, "first": first_name, "last": last_name, "spots": rentals };
				changeInfo(replace_user);
			}
			else
			{
				if($scope.currentPass != currentPassword)
				{
					document.getElementById("previousPasswordCheck").style.color = 'red';
					document.getElementById("previousPasswordCheck").innerHTML = "X Incorrect Password";
					document.getElementById("newPasswordCheck").innerHTML = "";
					document.getElementById("newPasswordCheck2").innerHTML = "";
				}
				if($scope.newPass != $scope.newPass2)
				{
					document.getElementById("newPasswordCheck").style.color = 'red';
					document.getElementById("newPasswordCheck").innerHTML = "X Passwords do not match";
					document.getElementById("newPasswordCheck2").style.color = 'red';
					document.getElementById("newPasswordCheck2").innerHTML = "X";
					document.getElementById("previousPasswordCheck").innerHTML = "";
				}
				if(!validObj.valid)
				{
					document.getElementById("newPasswordCheck").style.color = 'red';
					document.getElementById("newPasswordCheck").innerHTML = "X Invalid Password 6-20 Characters";
					document.getElementById("newPasswordCheck2").style.color = 'red';
					document.getElementById("newPasswordCheck2").innerHTML = "X";
					document.getElementById("previousPasswordCheck").innerHTML = "";
				}
			}
		}
	}
	
	$scope.changeEmail = function()
	{
		if($scope.currentEmail && $scope.newEmail)
		{
			
			var currentEmail = email;
			var validEmail = validateEmail( $scope.newEmail );
			if(($scope.currentEmail == currentEmail) && (validEmail))
			{
				rentals = user.spots;
				var currentPassword = user.password;
				var replace_user = {"_id": user_id, "username": username, "password": currentPassword, "email": $scope.newEmail, "first": first_name, "last": last_name, "spots": rentals };
				changeInfo(replace_user);
			}
			else
			{
				if($scope.currentEmail != currentEmail)
				{
					document.getElementById("previousEmailCheck").style.color = 'red';
					document.getElementById("previousEmailCheck").innerHTML = "X Emails do not match";
					document.getElementById("newEmailCheck").innerHTML = "";
				}
				if(!validEmail)
				{
					document.getElementById("newEmailCheck").style.color = 'red';
					document.getElementById("newEmailCheck").innerHTML = "X Invalid Email";
					document.getElementById("previousEmailCheck").innerHTML = "";
				}
			}
		}
	}
	
	function changeInfo(newUser)
	{
		$http.post('/changeInfo', newUser)
			.success( function( response ){	
				alert( "Succesfully changed information." );
				location.reload();
			} )
			.error( function( response ){
				
				alert( "Error changing information." );
			});		
	}
}]);

function validateSignup( password, password2 ) {

	var valid = true;
	var alert = "";
	
	if( password.length < 6 || password.length > 20 )
	{
		valid = false;
	}
	
	return {"valid": valid, "alert": alert};
}

function validateEmail( email ) {
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
	var valid = true;
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
        valid = false;
    }
	return valid;
}
