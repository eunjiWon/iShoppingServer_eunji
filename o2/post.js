var express = require("express");
var app = express();
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");

app.use(bodyParser.urlencoded({extended: false})) ;
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());

app.post('/api/test', function(req, res){
	console.log("amumal");
	console.log(req.body);
	var response = "Loud and Clear";
	res.json(response);
});
app.listen(80);
console.log("connect 80");
