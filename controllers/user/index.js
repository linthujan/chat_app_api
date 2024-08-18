const { User, Asset } = require('../../models');
const routeHandler = require('../../utils/routeHandler');
const { findModelOrThrow, validateNullParameters, } = require('../../utils/validation');
const { STATUS_CODE } = require('../../utils/constants');
const jwt = require('jsonwebtoken');
const { sendAppError } = require('../../utils/AppError');

const create = routeHandler(async (req, res, extras) => {
    const {
        body: {
            username,
            mobile,
        },
    } = req;

    validateNullParameters([username, mobile,])

    const [user, isCreated] = await User.upsert({
        username,
        mobile,
    }, { transaction: extras.transaction });

    await user.reload({ transaction: extras.transaction, paranoid: false });
    if (user.isSoftDeleted()) {
        await user.restore({ transaction: extras.transaction });
    }

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    await extras.transaction.commit();

    // return sendAppError(extras, "Passwords not match!", STATUS_CODE.BAD_REQUEST);
    console.log("token", token, user.user_id);

    return res.sendRes({ user, token }, {
        message: 'User created successfully',
        status: STATUS_CODE.CREATED,
    });
});

const getAuth = routeHandler(async (req, res, extras) => {
    const { user_id } = req.auth;

    const user = await findModelOrThrow({ user_id }, User, {
        include: [
            {
                model: Asset,
                as: 'image',
            },
        ]
    });

    return res.sendRes(user, {
        message: 'User found',
        status: STATUS_CODE.OK,
    });
}, false);

const getById = routeHandler(async (req, res, extras) => {
    const { user_id } = req.params;

    const user = await findModelOrThrow({ user_id }, User, {
        include: [
            {
                model: Asset,
                as: 'image',
            },
        ]
    });

    return res.sendRes(user, {
        message: 'User found',
        status: STATUS_CODE.OK,
    });
}, false);

const getAll = routeHandler(async (req, res, extras) => {
    const users = await User.findAll({
        include: [
            {
                model: Asset,
                as: 'image',
            },
        ],
    })

    return res.sendRes(users, {
        message: 'Users loaded successfully',
        status: STATUS_CODE.OK,
    });
}, false);

module.exports = {
    create,
    getAuth,
    getById,
    getAll,
}