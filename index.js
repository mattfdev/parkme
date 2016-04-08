var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var Store = require("jfs");
var db = new Store("db");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Templates will go in the following directory
app.set('views', __dirname + '/public');
app.set('view engine', 'html');

app.get('/', function(request, response) {
    response.render('index');
});

app.get("/user-login", function(req, res) {

	db.get("users", function(err, obj){
		
		res.status(200).json(obj);
	});
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
})
