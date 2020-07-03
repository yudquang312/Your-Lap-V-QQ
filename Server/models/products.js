const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 10,
        require: true
    },
    description: {
        type: String,
        min: 30,
        require: true
    },
    images: [{
        url: {
            type: String,
            require: true
        },
        id: {
            type: String,
            require: true
        }
    }],
    entryPrice: {
        type: Number,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    NSX: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NSX',
        require: true,
    },
    amount: {
        type: Number,
        require: true
    },
    typeProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
        require: true,
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
        },
        message: {
            type: String,
        }
    }],
    deleteAt: {
        type: Date
    },
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;