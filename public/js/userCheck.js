window.onload = function() {

	if( sessionStorage.getItem("username") == null ){
	
		var html = '<li><a href="#/signup">Sign Up</a></li>'
		html += '<li><a href="#/login">Login</a></li>';
		document.getElementById( "userCheck" ).innerHTML = html;		
	}
	else {
	
		var html = '<li><a href="#" onclick="return logout();">Logout</a></li>';
		document.getElementById( "userCheck" ).innerHTML = html;	
	}
}

function logout() {
	
	sessionStorage.removeItem( "username" );
	window.location.href = "#/";
	location.reload();
}