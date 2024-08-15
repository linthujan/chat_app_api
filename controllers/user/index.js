const { User, Asset } = require('../../models');
const util = require("../../utils/utility")
const routeHandler = require('../../utils/routeHandler');
const { findModelOrThrow, isNullParameters, isEmptyStringParameters, } = require('../../utils/validation');
const { STATUS_CODE } = require('../../utils/constants');
const jwt = require('jsonwebtoken');

const create = routeHandler(async (req, res, extras) => {
    const {
        body: {
            username,
            mobile,
        },
    } = req;

    isNullParameters([username, mobile,])

    const user = await User.create({
        username,
        mobile,
    }, { transaction: extras.transaction });

    const token = jwt.sign({ user_id: user.user_id });
    return res.sendRes({ user, token }, {
        message: 'User created successfully',
        status: STATUS_CODE.CREATED,
    });
});

// const getById = routeHandler(async (req, res, extras) => {
//     const { user_id } = req.params;

//     const user = await findModelOrThrow({ user_id }, User, {
//         include: [
//             {
//                 model: Asset,
//                 as: 'profile',
//             },
//         ]
//     });

//     return res.sendRes(user, {
//         message: 'User found',
//         status: STATUS_CODE.OK,
//     });
// }, false)

// const getAll = routeHandler(async (req, res, extras) => {
//     const { rows, count } = await User.findAndCountAll({
//         include: [
//             {
//                 model: Asset,
//                 as: 'profile',
//             },
//         ],
//         ...extras.pagination
//     })

//     return res.sendRes(rows, {
//         message: 'Users loaded successfully',
//         status: STATUS_CODE.OK,
//         ...extras.pageData,
//         count: count,
//     });
// }, false);

// const updateById = routeHandler(async (req, res, extras) => {
//     const { user_id } = req.params;

//     const {
//         body: {
//             username,
//             mobile_no,
//             email,
//             first_name,
//             last_name,
//             password,
//             password_confirm,
//         },
//         file
//     } = req;

//     extras.setErrorCallback(() => {
//         if (file) {
//             file => util.deleteFile(file.path);
//         }
//     })

//     isEmptyStringParameters([username, mobile_no, email, first_name, password, password_confirm]);

//     if (password && password !== password_confirm) {
//         return sendAppError(extras, "Passwords not match!", STATUS_CODE.BAD_REQUEST);
//     }

//     const user = await findModelOrThrow({ user_id }, User, {
//         include: {
//             model: Asset,
//             as: 'profile',
//         }
//     });

//     await user.update({
//         username,
//         mobile_no,
//         email,
//         first_name,
//         last_name,
//         password,
//     });

//     const profile = await user.getProfile();

//     if (file && profile) {
//         await profile.update({
//             name: file.filename,
//         }, { transaction: extras.transaction, })
//     }
//     else if (file) {
//         await Asset.create({
//             owner_id: user.user_id,
//             name: file.filename,
//             asset_type: 'user_profile',
//         }, { transaction: extras.transaction, })
//     }

//     await extras.transaction.commit();

//     // reload user with profile
//     return res.sendRes(user, {
//         message: 'User updated successfully',
//         status: STATUS_CODE.OK,
//     });
// })

// const deleteById = routeHandler(async (req, res, extras) => {
//     const { user_id } = req.params;

//     const user = await findModelOrThrow({ user_id }, User);
//     await user.destroy({ transaction: extras.transaction });
//     await extras.transaction.commit();
//     return res.sendRes(null, {
//         message: 'User deleted successfully',
//         status: STATUS_CODE.OK,
//     });
// })

module.exports = {
    create,
    // getById,
    // getAll,
    // updateById,
    // deleteById,
}