const ProductType = require("../models/productType");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");

const deletePT = async (req, res, next) => {
    try {
        const { id } = req.params;
        const PTDelete = await ProductType.findOne({
            _id: id,
            deleteAt: undefined,
        }).lean();
        if (!PTDelete) {
            return res.status(200).json({
                message: "Product type not found",
            });
        }
        await ProductType.updateOne(
            { _id: id },
            { $set: { deleteAt: new Date() } }
        );
        return res.status(200).json({
            message: "Delete",
        });
    } catch (e) {
        next(e);
    }
};

const getPT = async (req, res, next) => {
    try {
        const { id } = req.params;
        const pt = await ProductType.findOne({
            _id: id,
            deleteAt: undefined,
        }).lean();
        if (!pt)
            return res.status(200).json({
                message: "Product not found",
            });
        return res.status(200).json({
            message: "PRODUCT_TYPE",
            pt,
        });
    } catch (e) {
        next(e);
    }
};

const getAllPT = async (req, res, next) => {
    try {
        const listPT = await ProductType.find({ deleteAt: undefined }).lean();
        return res.status(200).json({
            message: "List Product Type",
            listPT,
        });
    } catch (e) {
        next(e);
    }
};
const createPT = async (req, res, next) => {
    try {
        const data = req.body;
        const createdPT = await ProductType.create(data);
        return res.status(200).json({
            message: "Created",
            createdPT,
        });
    } catch (e) {
        next(e);
    }
};

const updatePT = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        _.omitBy(data, _.isNull);
        const existedPT = await ProductType.findOne({ _id: id });
        // console.log('checktontai', existedPT)
        if (!existedPT) {
            return res.status(200).json({
                message: "Product not found",
            });
        }
        const updateInfo = { $set: data };
        const PTUpdate = await ProductType.findOneAndUpdate(
            { _id: id, deleteAt: undefined },
            updateInfo,
            {
                new: true,
            }
        ).lean();

        return res.status(200).json({
            message: "Updated",
            data: PTUpdate,
            data_update: updateInfo,
        });
    } catch (e) {
        return next(e);
    }
};

module.exports = {
    deletePT,
    getAllPT,
    getPT,
    createPT,
    updatePT,
};
