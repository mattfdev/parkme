window.onload = function() {

	if( sessionStorage.getItem("username") == null ){
	
		var html = '<li><a href="#/signup"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> Sign Up</a></li>'
		html += '<li><a href="#/login"><span class="glyphicon glyphicon-log-in" aria-hidden="true"></span> Login</a></li>';
		document.getElementById( "userCheck" ).innerHTML = html;		
	}
	else {
		var user = sessionStorage.getItem("username");
		var html = '<li><a href="#/settings"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span> ' + user + '</a></li>'
		html += '<li><a href="#" onclick="return logout();"><span class="glyphicon glyphicon-log-out" aria-hidden="true"></span> Logout</a></li>';
		document.getElementById( "userCheck" ).innerHTML = html;	
	}
    $(".navbar-nav li a").click(function(event) {
    $(".navbar-collapse").collapse('hide');
        });
}

function logout() {
	
	sessionStorage.removeItem( "username" );
	sessionStorage.removeItem( "user._id" );
	sessionStorage.removeItem( "email" );
	window.location.href = "#/";
	location.reload();
}