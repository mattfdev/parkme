angular.module("parkmeApp", ['ngRoute'])
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
	.when("/search", {
		
		templateUrl: "search.html",
		controller: "SearchController"
	})
})