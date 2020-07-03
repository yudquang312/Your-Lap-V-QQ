const OrderDetail = require('../models/orderDetail');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const randomstring = require("randomstring");

const deleteOrderDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const OrderDetailDelete = await OrderDetail.findOne({_id: id, deleteAt: undefined}).lean();
        if (!OrderDetailDelete) {
            return next(new Error('OrderDetail_NOT_FOUND'));
        }
        await OrderDetail.updateOne({ _id: id }, {$set: { deleteAt: new Date() }} );
        return res.status(200).json({
            message : 'delete OrderDetail successful',
        });
    } catch (e) {
        next(e);
    }
};

const getOrderDetail = async (req, res, next) => {
    try {
        const {id} = req.params;
        const orderDetail = await OrderDetail.findOne({order: id, deleteAt: undefined}).lean().populate({
            path: 'order'
        });
        console.log(orderDetail)
        if(!orderDetail) return next(new Error('OrderDetail_NOT_FOUND'));
        return res.status(200).json({
            message: 'OrderDetail', 
            orderDetail
        })
    } catch (e) {
        next(e);
    }
}


const getAllOrderDetail = async (req, res, next) => {
    try {
        let { page, limit } = req.query;
        if(!page) {
            page = 0;
        }
        else {
            page = parseInt(page)
        }
        if(!limit) {
            limit = 0;
        }
        else {
            limit = parseInt(limit);
        }
        let sort, skip;
        sort = {
            createdAt: -1
        }
        if(page) {
            skip = (page - 1) * limit;
        }
        // if(date) {
        //     sort = {
        //         createdAt: date === "true"? 1 : -1,
        //     }
        // }
        const listOrderDetail = await OrderDetail.find({deleteAt: undefined}).lean().populate({
            path: 'order'
        }).populate({
            path: 'products.$.productId'
        })
        .sort(sort)
        .limit(limit)
        .skip(skip);
        return res.status(200).json({
            message: 'ListOrderDetail',
            listOrderDetail
        })
    } catch (e) {
        next(e)
    }
}
const createOrderDetail = async (req, res, next) => {
    try {
        const data = req;
        const createdOrderDetail = await OrderDetail.create(data);
        // return res.status(200).json({
        //     message: "create OrderDetail successfully",
        //     createdOrderDetail
        // });
        return createOrderDetail;
    } catch (e) {
        next(e);
    }
}

const updateOrderDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        _.omitBy(data, _.isNull);
        const existedOrderDetail = await OrderDetail.findOne({ _id: id, deleteAt: undefined });
        if (!existedOrderDetail) {
            return next(new Error('OrderDetail_NOT_FOUND'));
        }
        const updateInfo = { $set: data };
        const OrderDetailUpdate = await OrderDetail.findOneAndUpdate({_id: id, deleteAt: undefined }, updateInfo, {
            new: true
        }).lean();
        
        return res.status(200).json({
            message : 'update successful',
            data: OrderDetailUpdate,
            data_update: updateInfo
        });
        
    } catch (e) {
        return next(e);
    }
};

module.exports = {
    deleteOrderDetail,
    getOrderDetail,
    getAllOrderDetail,
    updateOrderDetail,
    createOrderDetail
}