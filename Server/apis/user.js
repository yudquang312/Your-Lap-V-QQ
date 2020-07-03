
const controllerUser = require('../controllers/users.js');
const userValidation = require('../validations/user');
const { validate }= require('express-validation');

exports.load = (app) => {
    app.post('/api/v1/users' ,controllerUser.createUser);
    app.post('/api/v1/login',controllerUser.login);
    app.delete('/api/v1/users/:id' ,controllerUser.deleteUser);
    app.get('/api/v1/users/:id',controllerUser.getUser);
    app.get( '/api/v1/users', controllerUser.getAllUser);
    app.put('/api/v1/users/:id' ,controllerUser.updateUser);
    app.post('/api/v1/users/forget-password' ,controllerUser.forgetPassword);
    app.post('/api/v1/users/reset-password',controllerUser.resetPassword);
    app.post('/api/v1/loginFB',controllerUser.loginFB);
    app.put('/api/v1/verifyemail', controllerUser.verifyEmail);
    app.put('/api/v1/sendcode', controllerUser.sendCode);
    app.put('/api/v1/changepw/:id', controllerUser.changePassword);
    app.post('/api/v1/users/loginadmin', controllerUser.loginAdmin);
    // app.get('/api/v1/auth', validate(userValidation.creatUser) ,controllerUser.geUserWithToken)
}