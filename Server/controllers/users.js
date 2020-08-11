const User = require("../models/users");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
const Cart = require("../models/cart");
const { sign, verify } = require("../helper/jwt-helper");
const randomstring = require("randomstring");
const sendMail = require("../helper/mailer");
const axios = require("axios");

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userDelete = await User.findOne({
            _id: id,
            deleteAt: undefined,
        }).lean();
        if (!userDelete) {
            return res.status(200).json({
                message: "User not found",
            });
        }
        await User.updateOne({ _id: id }, { $set: { deleteAt: new Date() } });
        return res.status(200).json({
            message: "Deleted",
        });
    } catch (e) {
        return next(e);
    }
};

const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({
            _id: id,
            deleteAt: undefined,
        }).lean();
        if (!user) return next(new Error("USER_NOT_FOUND"));
        return res.status(200).json({
            message: "User",
            user,
        });
    } catch (e) {
        return next(e);
    }
};

const getAllUser = async (req, res, next) => {
    try {
        const listUser = await User.find({ deleteAt: undefined })
            .select("-password")
            .lean();
        return res.status(200).json({
            message: "ListUser",
            listUser,
        });
    } catch (e) {
        return next(e);
    }
};

const createUser = async (req, res, next) => {
    try {
        const data = req.body;
        console.log(data);
        const salt = bcrypt.genSaltSync(2);
        console.log(data);
        const checkUser = await User.findOne({ email: data.email });
        if (checkUser) {
            return next(new Error("Email is already in use"));
        }
        const code = randomstring.generate({
            length: 6,
            charset: "alphanumeric",
            capitalization: "uppercase",
        });

        const hashPassword = bcrypt.hashSync(data.password, salt);
        data.password = hashPassword;
        data.verifyCode = code;
        data.verifyCodeExpiredAt = new Date();
        const createdUser = await User.create(data);
        if (createUser) {
            await sendMail(data.email, `Ma xac thuc cua ban la : ` + code);
            const user = await User.findOne({ email: data.email });
            const cart = {
                user: user._id,
                cart: [],
            };
            await Cart.create(cart);
        }
        return res.status(200).json({
            message: "create user successfully",
            createdUser,
        });
    } catch (e) {
        return next(e);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        // if(data.password) {
        //     const salt = bcrypt.genSaltSync(2);
        //     const hashPassword = bcrypt.hashSync(data.password, salt);
        //     data.password = hashPassword;
        // }
        _.omitBy(data, _.isNull);
        const existedUser = await User.findOne({
            _id: id,
            deleteAt: undefined,
        }).lean();
        if (!existedUser) {
            return next(new Error("USER_NOT_FOUND"));
        }
        const updateInfo = { $set: data };
        const userUpdate = await User.findOneAndUpdate(
            { _id: id, deleteAt: undefined },
            updateInfo,
            {
                new: true,
            }
        ).lean();

        return res.status(200).json({
            message: "update successful",
            data: userUpdate,
            data_update: updateInfo,
        });
    } catch (e) {
        return next(e);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newPw, oldPw } = req.body;
        const user = await User.findOne({
            _id: id,
            deleteAt: undefined,
        }).lean();
        if (!user) {
            return next(new Error("USER_NOT_FOUND"));
        }
        console.log(user);
        const isValidatePassword = bcrypt.compareSync(oldPw, user.password);
        console.log(isValidatePassword);
        if (!isValidatePassword) {
            return next(new Error("PASSWORD_IS_INCORRECT"));
        }
        const salt = bcrypt.genSaltSync("10");
        const hashPassword = bcrypt.hashSync(newPw, salt);
        const updateUser = await User.updateOne(
            { _id: id, deleteAt: undefined },
            { password: hashPassword }
        ).lean();
        return res.status(200).json({
            message: "update password success",
            data: updateUser,
        });
    } catch (e) {
        return next(e);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email: email, deleteAt: undefined })
            .select("verifyCode verifyCodeExpiredAt")
            .lean();
        if (!user) {
            return next(new Error("EMAIL_NOT_INVALID"));
        }
        if (user.verifyCode === null) {
            return next(new Error("YOU_HAVE_NOT_REQUESTED_VERIFY_EMAIL"));
        }
        if (code !== user.verifyCode) {
            return next(new Error("CODE_NOT_INVALID"));
        }
        if (new Date() - user.verifyCodeExpiredAt > 1000 * 60 * 10) {
            return next(new Error("CODE_EXPIRED"));
        }
        const update = await User.updateOne(
            { email, deleteAt: undefined },
            { verifyCode: undefined }
        );
        return res.status(200).json({
            message: "update successful",
            data: update,
        });
    } catch (e) {
        return next(new Error(e));
    }
};

const sendCode = async (req, res, next) => {
    try {
        const { email } = req.body;
        const code = randomstring.generate({
            length: 6,
            charset: "alphanumeric",
            capitalization: "uppercase",
        });
        await sendMail(email, `Ma xac thuc cua ban la : ` + code);
        const data = await User.updateOne(
            { email },
            { verifyCode: code, verifyCodeExpiredAt: new Date() }
        );
        return res.status(200).json({
            message: "We have sent the code",
            data,
        });
    } catch (e) {
        return next(new Error(e));
    }
};

const login = async (req, res, next) => {
    try {
        const data = req.body;
        const salt = bcrypt.genSaltSync("10");
        const hashPassword = bcrypt.hashSync(data.password, salt);
        // const password = hashPassword;
        const user = await User.findOne({
            email: data.email,
            deleteAt: undefined,
            verifyCode: null,
        });
        if (!user) {
            // return next(new Error('USERNAME_NOT_EXISTED'));
            return next(new Error("USER_NOT_FOUND"));
        }
        const isValidatePassword = bcrypt.compareSync(
            data.password,
            user.password
        );
        if (!isValidatePassword) {
            return next(new Error("PASSWORD_IS_INCORRECT"));
        }
        console.log(user);
        const token = sign({ _id: user._id });
        return res.status(200).json({
            message: "login successfully",
            access_token: token,
            userId: user._id,
            username: user.fullname,
        });
    } catch (e) {
        return next(e);
    }
};

const loginAdmin = async (req, res, next) => {
    try {
        const data = req.body;
        const salt = bcrypt.genSaltSync("10");
        const hashPassword = bcrypt.hashSync(data.password, salt);
        // const password = hashPassword;
        const user = await User.findOne({
            email: data.email,
            type: "admin",
            deleteAt: undefined,
        });
        if (!user) {
            // return next(new Error('USERNAME_NOT_EXISTED'));
            return next(new Error("USER_NOT_FOUND"));
        }
        const isValidatePassword = bcrypt.compareSync(
            data.password,
            user.password
        );
        if (!isValidatePassword) {
            return next(new Error("PASSWORD_IS_INCORRECT"));
        }
        console.log(user);
        const token = sign({ _id: user._id });
        return res.status(200).json({
            message: "login successfully",
            access_token: token,
            userId: user._id,
            username: user.fullname,
        });
    } catch (e) {
        return next(e);
    }
};

const geUserWithToken = async (req, res, next) => {
    try {
        const token = req.query.token;
        const user = verify(token);
        if (!user) {
            // return next(new Error('USERNAME_NOT_EXISTED'));
            return next(new Error("TOKEN_KHONG_HOP_LE"));
        }
        return res.status(200).json({
            message: "token hop le",
            user,
        });
    } catch (e) {
        return next(e);
    }
};

const loginFB = async (req, res, next) => {
    try {
        const { accessToken } = req.body;
        let token, userId;
        const responseFB = await axios.get(
            `https://graph.facebook.com/me?access_token=${accessToken}&fields=email,name`
        );
        console.log(responseFB.data);
        const { id, email, name } = responseFB.data;
        const existedUser = await User.findOne({ facebook: { id } });
        if (!existedUser) {
            const newUser = await User.create({
                facebook: { id },
                email,
                fullname: name,
            });
            token = sign({ _id: newUser._id });
            userId = newUser._id;
        } else {
            const update = await User.findOneAndUpdate(
                { facebook: { id } },
                { email, fullname: name }
            );
            token = sign({ _id: update._id });
            userId = update._id;
            console.log(update);
        }
        // console.log(update)

        return res.status(201).json({
            message: "login successfully",
            access_token: token,
            userId: userId,
            username: name,
        });
    } catch (e) {
        return next(e);
    }
};

const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const existedEmail = await User.findOne({
            email: email,
            deleteAt: undefined,
        });
        if (!existedEmail) {
            return next(new Error("EMAIL_OF_USER_NOT_FOUND"));
        }
        const code = randomstring.generate({
            length: 6,
            charset: "alphanumeric",
            capitalization: "uppercase",
        });
        await sendMail(email, code);
        await User.updateOne(
            { email },
            { verifyCode: code, verifyCodeExpiredAt: new Date() }
        );
        // return res.status(200).json({
        //     message: 'We sent you a mail'
        // });
        return res.status(200).json({
            message: "We sent you a mail",
        });
    } catch (e) {
        return next(new Error(e));
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({ email: email })
            .select("verifyCode verifyCodeExpiredAt")
            .lean();
        if (!user) {
            return next(new Error("EMAIL_NOT_INVALID"));
        }
        if (user.verifyCode === null) {
            return next(new Error("YOU_HAVE_NOT_REQUESTED_FORGET_PASSWORD"));
        }
        if (code !== user.verifyCode) {
            return next(new Error("CODE_NOT_INVALID"));
        }
        if (new Date() - user.verifyCodeExpiredAt > 1000 * 60 * 5) {
            return next(new Error("CODE_EXPIRED"));
        }
        const salt = bcrypt.genSaltSync(2);
        const hashPassword = bcrypt.hashSync(newPassword, salt);
        await User.updateOne(
            { email },
            { password: hashPassword, verifyCode: undefined }
        );
        return res.status(200).json({
            message: "change password successful",
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAllUser,
    getUser,
    login,
    updateUser,
    deleteUser,
    createUser,
    geUserWithToken,
    forgetPassword,
    resetPassword,
    loginFB,
    loginAdmin,
    verifyEmail,
    sendCode,
    changePassword,
};
