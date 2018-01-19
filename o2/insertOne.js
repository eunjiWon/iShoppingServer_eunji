var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db){
	if(err) throw err;
	var dbo = db.db("gasree_user");
	var myobj = {product_id: 154, state: 1};
	dbo.collection("orders").insertOne(myobj, function(err, res){
		if(err) throw err;
		console.log("1 document inserted");
		console.log(res);
		db.close();
});
});
