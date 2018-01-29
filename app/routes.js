var AuthenticationController = require('./controllers/authentication'), 
    TodoController = require('./controllers/todos'), 
    ImgController = require('./controllers/img'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');
 
var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
 
module.exports = function(app){
 
    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        todoRoutes = express.Router();
        imgRoutes = express.Router(); 
    // Auth Routes
    apiRoutes.use('/auth', authRoutes);
 
    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
 
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });
 
    // Todo Routes
    apiRoutes.use('/users', todoRoutes);
 
    todoRoutes.get('/:user_id/todos', requireAuth, AuthenticationController.roleAuthorization(['reader','creator','editor']), TodoController.getTodos);
    todoRoutes.post('/:user_id/todos', requireAuth, AuthenticationController.roleAuthorization(['creator','editor']), TodoController.createTodo);
    todoRoutes.delete('/:user_id/todos/:todo_id', requireAuth, AuthenticationController.roleAuthorization(['editor']), TodoController.deleteTodo);
    
    // Img Routes
    apiRoutes.use('/users', imgRoutes);

    imgRoutes.get('/:user_id/images', requireAuth, AuthenticationController.roleAuthorization(['reader','creator','editor']), ImgController.getAllUploadedImg);
    imgRoutes.get('/:user_id/images/:img_id', requireAuth, AuthenticationController.roleAuthorization(['reader','creator','editor']), ImgController.getOneImgID);
    imgRoutes.post('/:user_id/images', requireAuth, AuthenticationController.roleAuthorization(['creator','editor']), ImgController.uploadNewImg);
    imgRoutes.delete('/:user_id/images/:img_id', requireAuth, AuthenticationController.roleAuthorization(['editor']), ImgController.deleteOneImgID);

    // Set up routes
    app.use('/api', apiRoutes);
 
}
