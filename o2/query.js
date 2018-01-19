var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
ObjectId = require('mongodb').ObjectID;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var query = {_id: ObjectId("5a5b1df584692c0fa544dd18")};
  dbo.collection("topic").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
