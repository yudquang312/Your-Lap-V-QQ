const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            require: true
        },
        amount: {
            type: Number,
            require: true
        },
        price: {
            type: Number,
            require: true
        }
    }], 
    deleteAt: {
        type: Date
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;