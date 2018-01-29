var multer = require('multer');
var imageModule = require('../models/img_model');
var path = require('path');
var fs = require('fs');
var del = require('del');
let UPLOAD_PATH = '/opt/tensorflow-for-poets-2/uploads/';
let PORT = 3000;
//multer Settings for file upload

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, UPLOAD_PATH)
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-'+Date.now())
    }
})

let upload = multer ({ storage: storage})

exports.getAllUploadedImg = function(req, res, next){
     imageModule.Image.find({userID: req.params.user_id}, '-__v').lean().exec((err, images) => {
    // imageModule.find({userID: req.params.user_id}, '-__v').lean().exec((err, images) => {
        if (err) {
            console.log("이미지 겟 fail1");
            res.sendStatus(400);
        }
        console.log("이미지 겟 성공1");
        // Manually set the correct URL to each image
        let user_id = req.params.user_id;
        for (let i = 0; i < images.length; i++) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/api/users/' + user_id +'/images/' + img._id;
        }
        res.json(images);
    }) 
}
exports.getOneImgID = function(req, res, next){
    let imgId = req.params.img_id;
     imageModule.Image.findById(imgId, (err, image) => {
        if (err) {
            console.log("이미지 겟 fail2");
            res.sendStatus(400);
        }
        console.log("이미지 겟 성공2");
        // stream the image back by loding the file
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(UPLOAD_PATH, image.filename)).pipe(res);
    })
}
 
exports.uploadNewImg = function(req, res, next){
     // Create a new image model and fill the properties
   // upload.single('image');
    let newImage = new imageModule.Image;
    newImage.filename = req.file.filename;
    newImage.originalName = req.file.originalname;
    newImage.desc = req.body.desc;
    newImage.lat = req.body.lat;
    newImage.lon = req.body.lon;
    console.log("desc : " + req.body.desc);
    console.log("lat : " + req.body.lat);
    newImage.userID = req.params.user_id;
    newImage.save(err => {
        if (err) {
            console.log("이미지 포스트(저장) fail");
            return res.sendStatus(400);
        }
        console.log("이미지 포스트(저장) 성공");
        res.status(201).send({ newImage });
    });
}

exports.deleteOneImgID = function(req, res, next){
    let imgId = req.params.img_id;

     imageModule.Image.findByIdAndRemove(imgId, (err, image) => {
        if (err && image) {
            res.sendStatus(400);
        }
    console.log("delete: ", image);
        del([path.join(UPLOAD_PATH, image.filename)]).then(deleted => {
            res.sendStatus(200);
        })
    })
}

