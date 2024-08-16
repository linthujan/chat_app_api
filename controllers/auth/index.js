const { User, Asset } = require('../../models');
const routeHandler = require('../../utils/routeHandler');
const jwt = require('jsonwebtoken');
const { findModelOrThrow, validateNullParameters, } = require('../../utils/validation');
const { STATUS_CODE } = require('../../utils/constants');

const login = routeHandler(async (req, res, extras) => {
    const { body: { mobile }, } = req;

    validateNullParameters([mobile])
    const user = await findModelOrThrow({ mobile }, User, {
        include: [
            {
                model: Asset,
                as: 'image',
            }
        ]
    });

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    return res.sendRes({ user, token, }, {
        message: 'User logged in successfully',
        status: STATUS_CODE.OK,
    });
}, false);


module.exports = {
    login,
}