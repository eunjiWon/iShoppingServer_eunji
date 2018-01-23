/*
* Created on 2018.01.19
* @author: eunjiwon
*/
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
var passport = require('passport');

// tensorflow connect
var PythonShell = require('python-shell');
var options = {
	args: ['--graph=tf_files/retrained_graph.pb', '--image=tf_files/flower_photos/roses/2414954629_3708a1a04d.jpg'],       
	scriptPath: '/opt/tensorflow-for-poets-2/scripts'
};
PythonShell.run('label_image.py', options, function (err, res) {
	if (err) {console.log("err is  " + err);}
	console.log("성공	: " + res);
});             

// Configuration
mongoose.connect('mongodb://localhost/iShopping');
//mongoose.connect('mongodb://testUser:test@localhost/test');

//mongoose.Promise = global.Promise;
 
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
 
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
 
// Models
var clothInf = mongoose.model('clothInf', {
    name: String,
    spot: String,
    price: Number
});
 
// Routes
 
    // Get reviews
    app.get('/history', function(req, res) {
        console.log("클라에서 get으로 들어왔다"); 
        // use mongoose to get all reviews in the database
        clothInf.find(function(err, result) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(result); // return all reviews in JSON format
        });
    });
 
    // create review and send back all reviews after creation
    app.post('/history', function(req, res) {
 
        console.log("클라에서 포스트로 받아서 디비 추가했어요");
 
        // create a review, information comes from request from Ionic
        clothInf.create({
            name : req.body.name,
            spot : req.body.spot,
            price: req.body.price,
            done : false
        }, function(err, res) {
            if (err)
                console.log("만드는데 " + err);  
            // get and return all the reviews after you create another
            clothInf.find(function(err, results) {
                if (err)
                    console.log("search " + err);
               // res.json(results);
            });
        });
 
    });
 
    // delete a review
    app.delete('/history/:_id', function(req, res) {
        clothInf.remove({
            _id : req.params._id
        }, function(err, review) {
 
        });
    });
 
 
// listen (start app with node server.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");

