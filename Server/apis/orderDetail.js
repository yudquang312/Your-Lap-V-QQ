
const controllerOT = require('../controllers/orderDetail.js');

exports.load = (app) => {
    app.post('/api/v1/orderdetail', controllerOT.createOrderDetail);
    app.delete('/api/v1/orderdetail/:id', controllerOT.deleteOrderDetail);
    app.get('/api/v1/orderdetail/:id',  controllerOT.getOrderDetail);
    app.get( '/api/v1/orderdetail',  controllerOT.getAllOrderDetail);
    app.put('/api/v1/orderdetail/:id',  controllerOT.updateOrderDetail);
}