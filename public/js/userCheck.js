window.onload = function() {

	if( sessionStorage.getItem("username") == null ){
	
		var html = '<a href="#/login">Login</a>';
		document.getElementById( "userCheck" ).innerHTML = html;		
	}
	else {
	
		var html = '<a href="#" onclick="return logout();">Logout</a>';
		document.getElementById( "userCheck" ).innerHTML = html;	
	}
}

function logout() {
	
	sessionStorage.removeItem( "username" );
	window.location.href = "#/";
	location.reload();
}