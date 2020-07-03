const Product = require('../models/products');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const NSX = require('../models/NSX');
const ProductType = require('../models/productType')
const cloudinary = require('../helper/cloudinary');
const fs = require('fs')

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productDelete = await Product.findOne({ _id: id, deleteAt: undefined }).lean();
        if (!productDelete) {
            return next(new Error('USER_NOT_FOUND'));
        }
        await Product.updateOne({ _id: id }, { $set: { deleteAt: new Date() } });
        return res.status(200).json({
            message: 'delete product successful',
        });
    } catch (e) {
        next(e);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id, deleteAt: undefined }).lean().populate(
            {
                path: 'postBy',
                select: 'fullname'
            }
        ).populate(
            {
                path: 'typeProduct',
                select: 'name'
            }
        ).populate(
            {
                path: 'NSX',
                select: 'name'
            }
        );
        if (!product) return next(new Error('PRODUCT_NOT_FOUND'));
        return res.status(200).json({
            message: 'Product',
            product
        })
    } catch (e) {
        next(e);
    }
}

const getAllProducts = async (req, res, next) => {
    try {
        let { date, price, search, page, limit, amount } = req.query;
        if (!page) {
            page = 0;
        }
        else {
            page = parseInt(page)
        }
        if (!limit) {
            limit = 0;
        }
        else {
            limit = parseInt(limit);
        }
        let sort, skip;
        if (page) {
            skip = (page - 1) * limit;
        }
        if (date) {
            sort = {
                createdAt: date === "true" ? 1 : -1,
            }
        }
        if (amount) {
            sort = {
                amount: amount === "true" ? 1 : -1,
            }
        }
        if (price) {
            sort = {
                price: price === "true" ? 1 : -1,
            }
        }
        let ListProducts = await Product
            .find({ deleteAt: undefined })
            .lean()
            .populate(
                {
                    path: 'postBy',
                    select: 'fullname'
                }
            ).populate(
                {
                    path: 'typeProduct NSX',
                    select: 'name nation'
                }
            ).sort(
                sort
            )
            .limit(limit)
            .skip(skip);
        if (search) {
            ListProducts = ListProducts.filter((pd) => {
                return pd.name.toLowerCase().includes(search.toLowerCase());
            })
        }
        return res.status(200).json({
            message: 'ListProducts',
            data: ListProducts
        })
    } catch (e) {
        next(e)
    }
}
const createProduct = async (req, res, next) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Images');
    try {
        const urls = [];
        console.log("res", req.body.images)
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);

            urls.push(newPath);
            fs.unlinkSync(path);
        }
        // console.log(req.files);
        const data = req.body;
        data.images = urls;
        // req.files.forEach(img => {
        //     data.images.push(img.filename);
        // });
        // const salt = bcrypt.genSaltSync(2);
        // console.log(data);
        // const hashPassword = bcrypt.hashSync(data.password, salt);
        // data.password = hashPassword;
        console.log(data);
        data.price = +data.price;
        data.entryPrice = +data.entryPrice;
        data.postBy = req.user._id;
        const existedNSX = await NSX.findOne({ _id: data.NSX });
        if (!existedNSX) {
            return new Error('NSX NOT FOUND')
        }
        const existedTypeProduct = await ProductType.findOne({ _id: data.typeProduct });
        if (!existedTypeProduct) {
            return new Error('Type Product NOT FOUND')
        }
        const createdProduct = await Product.create(data);
        return res.status(201).json({
            message: "create product successfully",
            createdProduct
        });
        // return res.location('http://localhost:3000/uploadProduct.html')
    } catch (e) {
        next(e);
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.NSX) {
            const existedNSX = await NSX.findOne({ _id: data.NSX });
            if (!existedNSX) {
                return new Error('NSX NOT FOUND')
            }
        }
        if (data.typeProduct) {
            const existedTypeProduct = await ProductType.findOne({ _id: data.typeProduct });
            if (!existedTypeProduct) {
                return new Error('Type Product NOT FOUND')
            }
        }
        // const salt = bcrypt.genSaltSync(2);
        // const hashPassword = bcrypt.hashSync(data.password, salt);
        // data.password = hashPassword;
        _.omitBy(data, _.isNull);
        const existedProduct = await Product.findOne({ _id: id });
        if (!existedProduct) {
            return next(new Error('USER_NOT_FOUND'));
        }
        const updateInfo = { $set: data };
        const productUpdate = await Product.findOneAndUpdate({ _id: id, deleteAt: undefined }, updateInfo, {
            new: true
        }).lean();

        return res.status(200).json({
            message: 'update successful',
            data: productUpdate,
            data_update: updateInfo
        });

    } catch (e) {
        return next(e);
    }
};

const getProductByType = async (req, res, next) => {
    const { id } = req.params;
    let { page, limit } = req.query;
    let skip;
    if (!page) {
        page = 0;
    }
    else {
        page = parseInt(page)
    }
    if (!limit) {
        limit = 0;
    }
    else {
        limit = parseInt(limit);
    }
    if (page) {
        skip = (page - 1) * limit;
    }
    const products = await Product.find({ typeProduct: id, deleteAt: undefined }).lean().populate(
        {
            path: 'postBy',
            select: 'fullname'
        }
    ).populate(
        {
            path: 'typeProduct NSX',
            select: 'name nation'
        }
    ).limit(limit).skip(skip);
    if (!products) {
        return next(new Error("TYPE_PRODUCT_IS_NOT_EXISTED"));
    }
    return res.status(200).json({
        message: 'List Product By Type',
        data: products,
    });
}
const getProductWithDate = async (req, res, next) => {
    const { check } = req.body;
    console.log(req)
    const products = await Product.find({ deleteAt: undefined }).lean().populate(
        {
            path: 'postBy',
            select: 'fullname'
        }
    ).populate(
        {
            path: 'typeProduct NSX',
            select: 'name nation'
        }
    )
    // .sort({
    //     createdAt: check? 1: -1
    // });
    if (!products) {
        return next(new Error("TYPE_PRODUCT_IS_NOT_EXISTED"));
    }
    return res.status(200).json({
        message: 'List Product By Type',
        data: products,
    });
}

module.exports = {
    getProduct,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductByType,
    getProductWithDate
}