const NSX = require("../models/NSX");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");

const deleteNSX = async (req, res, next) => {
    try {
        const { id } = req.params;
        const NSXDelete = await NSX.findOne({
            _id: id,
            deleteAt: undefined,
        }).lean();
        if (!NSXDelete) {
            return res.status(200).json({
                message: "NSX not found",
            });
        }
        await NSX.updateOne({ _id: id }, { $set: { deleteAt: new Date() } });
        return res.status(200).json({
            message: "Deleted",
        });
    } catch (e) {
        next(e);
    }
};

const getNSX = async (req, res, next) => {
    try {
        const { id } = req.params;
        const nsx = await NSX.findOne({ _id: id, deleteAt: undefined }).lean();
        if (!nsx)
            return res.status(200).json({
                message: "Product not found",
            });
        return res.status(200).json({
            message: "NSX",
            nsx,
        });
    } catch (e) {
        next(e);
    }
};

const getAllNSX = async (req, res, next) => {
    try {
        const listNSX = await NSX.find({ deleteAt: undefined }).lean();
        return res.status(200).json({
            message: "ListNSX",
            listNSX,
        });
    } catch (e) {
        next(e);
    }
};
const createNSX = async (req, res, next) => {
    try {
        const data = req.body;
        const createdNSX = await NSX.create(data);
        return res.status(200).json({
            message: "Created",
            createdNSX,
        });
    } catch (e) {
        next(e);
    }
};

const updateNSX = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        _.omitBy(data, _.isNull);
        const existedNSX = await NSX.findOne({ _id: id, deleteAt: undefined });
        if (!existedNSX) {
            return res.status(200).json({
                message: "Product not found",
            });
        }
        const updateInfo = { $set: data };
        const NSXUpdate = await NSX.findOneAndUpdate(
            { _id: id, deleteAt: undefined },
            updateInfo,
            {
                new: true,
            }
        ).lean();

        return res.status(200).json({
            message: "Updated",
            data: NSXUpdate,
            data_update: updateInfo,
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
    createNSX,
};
