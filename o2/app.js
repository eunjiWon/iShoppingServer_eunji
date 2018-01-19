var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
var ec2 = new AWS.EC2();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
ObjectId = require('mongodb').ObjectID;

app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true; // 사실 없어도 됨..
app.set('views', './views');
app.set('view engine', 'jade');

app.listen(80, function(){
	console.log('Connected, 80 port!');
})
app.get('/', function(req, res){
	console.log("연결됨.");
//	res.send("Hi");
})
app.post('/', function(req, res) {	 
	console.log("creating review");
	console.log(req.body.title);
	console.log(req.body.description);
});

/*
app.get('/ec2', function(req, res){
	ec2.describeInstances({}, function(err, data){
		res.json(data);
	})
})
*/
app.get('/topic/add', function(req, res){
	MongoClient.connect(url, function(err, db){
		if(err) throw err;
		var dbo = db.db("mydb");
		dbo.collection("topic").find({}).toArray(function(err, topics){
			if(err) throw err;
			res.render('add', {topics: topics});
			db.close();
		})
	})
})

app.post('/topic/add', function(req, res){
	var name = req.body.name;
	var address = req.body.address;
	MongoClient.connect(url, function(err, db){
		if(err) throw err;
		var dbo = db.db("mydb");
		var myobj = {name: name, address: address};
		dbo.collection("topic").insertOne(myobj, function(err, result){
			if(err) throw err;
			res.redirect('/topic/' + result.insertedId);
			db.close();
		})
	})
})

app.get('/topic/:id/edit', function(req, res){
	var id = req.params.id;
	MongoClient.connect(url, function(err, db){
		if(err) throw err;
		var dbo = db.db("mydb");
		dbo.collection("topic").find({}).toArray(function(err, topics){
			if(err) throw err;
			var query = {_id : ObjectId(id)};
			dbo.collection("topic").find(query).toArray(function(err, topic){
				if(err) throw err;
				res.render('edit', {topics: topics, _topic: topic[0]});
				db.close();
			})			
		})
	})
})
app.post('/topic/:id/edit', function(req, res){
	var id = req.params.id;
	var name = req.body.name;
	var address = req.body.address;
	MongoClient.connect(url, function(err, db){
		if(err) throw err;
		var dbo = db.db("mydb");
		var myquery = {_id: ObjectId(id)};
		var newvalues = {$set:{name: name, address: address}};
		dbo.collection("topic").updateOne(myquery, newvalues, function(err, result){
			if(err) throw err;
			res.redirect('/topic/' + id);
			db.close();
		})
	})	
})

app.get('/topic/:id/delete', function(req, res){
	var id = req.params.id;
	MongoClient.connect(url, function(err, db){
		if(err) throw err;
		var dbo = db.db("mydb");
		dbo.collection("topic").find({}).toArray(function(err, topics){
			if(err) throw err;
			var query = {_id : ObjectId(id)};
			dbo.collection("topic").find(query).toArray(function(err, topic){
				if(err) throw err;
				res.render('delete', {topics: topics, _topic: topic[0]});
				db.close();
			})			
		})
	})
})
app.post('/topic/:id/delete', function(req, res){
	var id = req.params.id;
	MongoClient.connect(url, function(err, db){
		if(err) throw err;
		var dbo = db.db("mydb");
		var myquery = {_id: ObjectId(id)};
		dbo.collection("topic").deleteOne(myquery, function(err, result){
			if(err) throw err;
			res.redirect('/topic/');
			db.close();
		})
	})
})	

app.post('/topic', function(req, res){
	var title = req.body.title;
	console.log("topic에post 연결 성공");
	console.log(title);

})

app.get(['/topic', '/topic/:id'], function(req, res){
	console.log("/topic	에 get으로 연결됨.");
	MongoClient.connect(url, function(err, db){
		if(err) throw err;
		var dbo = db.db("mydb");
		dbo.collection("topic").find({}).toArray(function(err, topics){
			var id = req.params.id;
			if(err) throw err;
				if(id){
					var query = {_id : ObjectId(id)};
					dbo.collection("topic").find(query).toArray(function(err, topic){
						if(err) throw err;
						res.render('view', {topics: topics, _topic: topic[0]});
						db.close();
					})			
				}	
				else{
					res.render('view', {topics: topics});
					db.close();				
				}
		})
	})
})			


