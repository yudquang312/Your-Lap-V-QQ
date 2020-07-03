const Cart = require('../models/cart');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const { ObjectId } = require('mongodb');
const Product = require('../models/products')
const deleteSP = async (req, res, next) => {
    try {
        const { userId, productId } = req.body;
        console.log(req.body)
        const cart = await Cart.findOne({user: userId}).lean();
        if (!cart) {
            return next(new Error('CART_NOT_FOUND'));
        }
        const product = cart.cart.some((c) => {
            console.log(c.productId, productId, c.productId.toString() === productId)
            return c.productId.toString() === productId;
        });
        if(!product) {
            return next(new Error('PRODUCT_DOES_NOT_EXIST_IN_CART'));
        }
        const result = await Cart.updateOne({ user: userId }, {$pull: { cart: {productId: productId}}} );
        return res.status(200).json({
            message : 'delete product in cart successful',
            result
        });
    } catch (e) {
        next(e);
    }
};

const resetCart = async (req) => {
    try {
        const { userId } = req;
        const cart = await Cart.findOne({user: userId}).lean();
        if (!cart) {
            return next(new Error('CART_NOT_FOUND'));
        }
        if(cart.product === 0) {
            return next(new Error('PRODUCT_DOES_NOT_EXIST_IN_CART'));
        }
        const result = await Cart.updateOne({ user: userId }, {cart: []} );
        // return res.status(200).json({
        //     message : 'delete product in cart successful',
        //     result
        // });
        return result;
    } catch (e) {
        next(e);
    }
};

const addSP = async (req, res, next) => {
    try {
        const { userId, productId, price, amount } = req.body;
        console.log(req.body)
        const cart = await Cart.findOne({user: userId}).lean();
        if (!cart) {
            return next(new Error('CART_NOT_FOUND'));
        }
        const product = cart.cart.filter((c) => {
            return c.productId.toString() == productId;
        });
        console.log(product)
        let cartUpdate, result;
        if(product.length === 0) {
            const productCart = {
                productId: productId,
                amount: amount || 1,
                price: +price
            }
            cartUpdate= await Cart.updateOne({ _id: cart._id }, {$push: { cart: productCart}} );
        }
        else {
            const productCart = {
                productId: productId,
                amount: parseInt(product[0].amount) + amount,
                price: +price
            }
            //  {$addToSet: { cart: productCart}} 
            // cartUpdate = await Cart.findOne({ _id: cart._id});
            cartUpdate = await Cart.updateOne({_id: cart._id, "cart.productId" : productId}, {$set: {"cart.$.amount": parseInt(product[0].amount) + amount}})
            // cartUpadte = await Cart.updateOne({_id: cart._id, "cart.${}._id": product._id}, {$inc: {"cart.$[].amount": amount}}, {multi: false})
        }
        // console.log(cart)
        return res.status(200).json({
            message : 'add product into cart successful',
            cartUpdate,
        });
    } catch (e) {
        next(e);
    }
};

const changeAmount = async (req, res, next) => {
    try {
        const { check, userId, productId } = req.body;
        if (!check) return;
        const cart = await Cart.findOne({user: userId}).lean();
        if (!cart) {
            return next(new Error('CART_NOT_FOUND'));
        }
        const product = cart.cart.filter((c) => {
            return c.productId.toString() === productId;
        });
        if(product.length <= 0) {
            return next(new Error('PRODUCT_DOES_NOT_EXIST_IN_CART'))
        }
        const getProduct = await Product.findOne({_id: productId}).lean();
        if(check === 'true') {

            const amount = (parseInt(product[0].amount)) < getProduct.amount ? 
                    parseInt(product[0].amount)+ 1 : 
                    parseInt(product[0].amount);

            if(parseInt(product[0].amount) < amount) {
                cartUpdate = await Cart.updateOne({_id: cart._id, "cart.productId" : productId}, {$set: {"cart.$.amount":  amount}});
                return res.status(200).json({
                    message : 'change amount product in cart successful',
                });
            }
            console.log(cartUpdate)
            return res.status(202).json({
                message : 'The quantity exceeds the limit',
            });
        }
        else {
            const amount = (parseInt(product[0].amount)) < getProduct.amount ? 
                    parseInt(product[0].amount) - 1 : 
                    parseInt(product[0].amount);
            if(amount === 0) {
                await Cart.updateOne({ user: userId }, {$pull: { cart: {productId: productId}}});
                return res.status(200).json({
                    message : 'delete cart success',
                });
            }
            cartUpdate = await Cart.updateOne({_id: cart._id, "cart.productId" : productId}, {$set: {"cart.$.amount": amount}})
            return res.status(200).json({
                message : 'change amount product in cart successful',
            });
        }

        // return res.status(200).json({
        //     message : 'change amount product in cart successful',
        // });
    } catch (e) {
        next(e);
    }
};

const getCart = async (req, res, next) => {
    try {
        const {id} = req.params;
        const cart = await Cart.findOne({user: id}).lean();
        return res.status(200).json({
            message: 'Cart',
            cart: cart
        })
    } catch (e) {
        next(e);
    }
}
const deleteCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cartDeleted = await Cart.findOne({_id: id}).lean();
        if (!cartDeleted) {
            return next(new Error('CART_NOT_FOUND'));
        }
        await Cart.updateOne({ _id: id }, {data: {$set: { deleteAt: new Date() }}} );
        return res.status(200).json({
            message : 'delete nsx successful',
        });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    deleteSP,
    addSP,
    changeAmount,
    getCart,
    deleteCart,
    resetCart
}