const { User, Asset } = require('../../models');
const routeHandler = require('../../utils/routeHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findModelOrThrow, isNullParameters, } = require('../../utils/validation');
const { STATUS_CODE } = require('../../utils/constants');
const { sendAppError } = require('../../utils/AppError');

const login = routeHandler(async (req, res, extras) => {
    const { body: { mobile }, } = req;

    isNullParameters([mobile])
    const user = await findModelOrThrow({ mobile }, User, {
        include: [
            // {
            //     model: Asset,
            //     as: 'profile',
            // }
        ]
    })

    // if (!bcrypt.compareSync(password, user.hashed_password)) {
    //     return sendAppError(extras, "Authentication failed!", STATUS_CODE.BAD_REQUEST)
    // }

    const token = jwt.sign({ user: user.user_id }, process.env.JWT_SECRET, {
        expiresIn: '10m',
    })

    // delete user.dataValues.hashed_password;
    // user.dataValues.token = token;
    return res.sendRes({
        user,
        token,
    }, {
        message: 'User authenticated successfully',
        status: STATUS_CODE.CREATED,
    });
}, false);


module.exports = {
    login,
}