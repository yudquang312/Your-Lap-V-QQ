const PromotionType = require('../models/promotionType');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const randomstring = require("randomstring");

const deletePromotionType = async (req, res, next) => {
    try {
        const { id } = req.params;
        const promotionTypeDelete = await PromotionType.findOne({_id: id, deleteAt: undefined}).lean();
        if (!promotionTypeDelete) {
            return next(new Error('PromotionType_NOT_FOUND'));
        }
        await PromotionType.updateOne({ _id: id },  {$set: { deleteAt: new Date() }} );
        return res.status(200).json({
            message : 'delete PromotionType successful',
        });
    } catch (e) {
        next(e);
    }
};

const getPromotionType = async (req, res, next) => {
    try {
        const {id} = req.params;
        const promotionType = await PromotionType.findOne({_id: id, deleteAt: undefined}).lean();
        if(!PromotionType) return next(new Error('PromotionType_NOT_FOUND'));
        return res.status(200).json({
            message: 'PromotionType',
            promotionType
        })
    } catch (e) {
        next(e);
    }
}

const getPromotionTypebyCode = async (req, res, next) => {
    try {
        const {code} = req.body;
        const promotionType = await PromotionType.findOne({code: code, deleteAt: undefined}).lean().populate({
            path: 'promotionTypeType'
        });
        if(!PromotionType) return next(new Error('PromotionType_NOT_FOUND'));
        return res.status(200).json({
            message: 'PromotionType',
            promotionType
        })
    } catch (e) {
        next(e);
    }
}

const getAllPromotionType = async (req, res, next) => {
    try {
        let { page, limit, date, state } = req.query;
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
        if(page) {
            skip = (page - 1) * limit;
        }
        // if(date) {
        //     sort = {
        //         createdAt: date === "true"? 1 : -1,
        //     }
        // }
        const listPromotionType = await PromotionType.find({deleteAt: undefined}).lean()
        // .sort(sort)
        .limit(limit)
        .skip(skip);
        return res.status(200).json({
            message: 'ListPromotionType',
            listPromotionType
        })
    } catch (e) {
        next(e)
    }
}
const createPromotionType = async (req, res, next) => {
    try {
        const data = req.body;
        const createdPromotionType = await PromotionType.create(data);
        return res.status(200).json({
            message: "create PromotionType successfully",
            createdPromotionType
        });
    } catch (e) {
        next(e);
    }
}

const updatePromotionType = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        _.omitBy(data, _.isNull);
        const existedPromotionType = await PromotionType.findOne({ _id: id, deleteAt: undefined });
        if (!existedPromotionType) {
            return next(new Error('PromotionType_NOT_FOUND'));
        }
        const updateInfo = { $set: data };
        const PromotionTypeUpdate = await PromotionType.findOneAndUpdate({_id: id, deleteAt: undefined }, updateInfo, {
            new: true
        }).lean();
        
        return res.status(200).json({
            message : 'update successful',
            data: PromotionTypeUpdate,
            data_update: updateInfo
        });
        
    } catch (e) {
        return next(e);
    }
};

module.exports = {
    deletePromotionType,
    getPromotionType,
    getAllPromotionType,
    updatePromotionType,
    createPromotionType
}