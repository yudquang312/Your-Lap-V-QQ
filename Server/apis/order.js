
const controllerOrder = require('../controllers/order.js');
const { checkAuthentication } = require('../middleware/authentication')

exports.load = (app) => {
    app.post('/api/v1/order', checkAuthentication, controllerOrder.createOrder);
    app.delete('/api/v1/order/:id', controllerOrder.deleteOrder);
    app.get('/api/v1/order/:id',  controllerOrder.getOrder);
    app.get('/api/v1/order/user/:id',  controllerOrder.getOrderWithUser);
    app.get( '/api/v1/order',  controllerOrder.getAllOrder);
    app.put('/api/v1/order/:id',  controllerOrder.updateOrder);
}