var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://gasree:2017@121.180.199.44:25321/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("gasree_user");
  dbo.collection("orders").find().limit(1).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
