const NSX = require('../models/NSX');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

const deleteNSX = async (req, res, next) => {
    try {
        const { id } = req.params;
        const NSXDelete = await NSX.findOne({_id: id, deleteAt: undefined}).lean();
        if (!NSXDelete) {
            return next(new Error('NSX_NOT_FOUND'));
        }
        await NSX.updateOne({ _id: id }, {$set: { deleteAt: new Date() }} );
        return res.status(200).json({
            message : 'delete nsx successful',
        });
    } catch (e) {
        next(e);
    }
};

const getNSX = async (req, res, next) => {
    try {
        const {id} = req.params;
        const nsx = await NSX.findOne({_id: id, deleteAt: undefined}).lean();
        if(!nsx) return next(new Error('NSX_NOT_FOUND'));
        return res.status(200).json({
            message: 'NSX',
            nsx
        })
    } catch (e) {
        next(e);
    }
}

const getAllNSX = async (req, res, next) => {
    try {
        const listNSX = await NSX.find({deleteAt: undefined}).lean();
        return res.status(200).json({
            message: 'ListNSX',
            listNSX
        })
    } catch (e) {
        next(e)
    }
}
const createNSX = async (req, res, next) => {
    try {
        const data = req.body;
        const createdNSX = await NSX.create(data);
        return res.status(200).json({
            message: "create nsx successfully",
            createdNSX
        });
    } catch (e) {
        next(e);
    }
}

const updateNSX = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        _.omitBy(data, _.isNull);
        const existedNSX = await NSX.findOne({ _id: id, deleteAt: undefined});
        if (!existedNSX) {
            return next(new Error('NSX_NOT_FOUND'));
        }
        const updateInfo = { $set: data };
        const NSXUpdate = await NSX.findOneAndUpdate({_id: id, deleteAt: undefined }, updateInfo, {
            new: true
        }).lean();
        
        return res.status(200).json({
            message : 'update successful',
            data: NSXUpdate,
            data_update: updateInfo
        });
        
    } catch (e) {
        return next(e);
    }
};

module.exports = {
    deleteNSX,
    getNSX,
    getAllNSX,
    updateNSX,
    createNSX
}