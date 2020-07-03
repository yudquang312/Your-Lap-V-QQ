const Promotion = require('../models/promotion');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const randomstring = require("randomstring");

const deletePromotion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const promotionDelete = await Promotion.findOne({_id: id, deleteAt: undefined}).lean();
        if (!promotionDelete) {
            return next(new Error('Promotion_NOT_FOUND'));
        }
        await Promotion.updateOne({ _id: id }, {$set: { deleteAt: new Date() }} );
        return res.status(200).json({
            message : 'delete Promotion successful',
        });
    } catch (e) {
        next(e);
    }
};

const getPromotion = async (req, res, next) => {
    try {
        const {id} = req.params;
        const promotion = await Promotion.findOne({_id: id, deleteAt: undefined}).lean().populate({
            path: 'promotionType'
        });
        if(!Promotion) return next(new Error('Promotion_NOT_FOUND'));
        return res.status(200).json({
            message: 'Promotion',
            promotion
        })
    } catch (e) {
        next(e);
    }
}

const getPromotionbyCode = async (req, res, next) => {
    try {
        const {code} = req.body;
        const promotion = await Promotion.findOne({code: code, deleteAt: undefined}).lean().populate({
            path: 'promotionType'
        });
        if(!Promotion) return next(new Error('Promotion_NOT_FOUND'));
        return res.status(200).json({
            message: 'Promotion',
            promotion
        })
    } catch (e) {
        next(e);
    }
}

const getAllPromotion = async (req, res, next) => {
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
        const listPromotion = await Promotion.find({deleteAt: undefined}).lean().populate(
            {
                path: 'user',
                // select: 'fullname'
            }
        ).populate(
            {
                path: 'promotion',
                // select: 'name nation'
            }
        )
        // .sort(sort)
        .limit(limit)
        .skip(skip);
        return res.status(200).json({
            message: 'ListPromotion',
            listPromotion
        })
    } catch (e) {
        next(e)
    }
}
const createPromotion = async (req, res, next) => {
    try {
        const data = req.body;
        data.code = randomstring.generate(6);
        const createdPromotion = await Promotion.create(data);
        return res.status(200).json({
            message: "create Promotion successfully",
            createdPromotion
        });
    } catch (e) {
        next(e);
    }
}

const updatePromotion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        _.omitBy(data, _.isNull);
        const existedPromotion = await Promotion.findOne({ _id: id, deleteAt: undefined });
        if (!existedPromotion) {
            return next(new Error('Promotion_NOT_FOUND'));
        }
        const updateInfo = { $set: data };
        const PromotionUpdate = await Promotion.findOneAndUpdate({_id: id, deleteAt: undefined }, updateInfo, {
            new: true
        }).lean();
        
        return res.status(200).json({
            message : 'update successful',
            data: PromotionUpdate,
            data_update: updateInfo
        });
        
    } catch (e) {
        return next(e);
    }
};

module.exports = {
    deletePromotion,
    getPromotion,
    getAllPromotion,
    updatePromotion,
    createPromotion
}