const { User } = require("../../models");
const AppError = require("../AppError");
const { STATUS_CODE } = require("../constants");
const jwt = require("jsonwebtoken");

module.exports.verifyJWT = (req, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new AppError("Invalid authorization header", STATUS_CODE.UNAUTHORIZED));
        }

        const token = authHeader.split(" ").pop();
        if (!token) {
            return next(new AppError("Authorization token not found", STATUS_CODE.UNAUTHORIZED));
        }

        console.log(token);
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        return payload;
    } catch (error) {
        console.log(error);
        next(new AppError(error.name, STATUS_CODE.UNAUTHORIZED));
    }
}

module.exports = async (req, res, next) => {
    console.log(`route URL ${req.originalUrl}`);

    const payload = this.verifyJWT(req, next);

    const user = await User.findOne({
        where: {
            user_id: payload.user_id,
        },
    });

    if (!user) {
        return next(new AppError("Invalid Token", STATUS_CODE.UNAUTHORIZED));
    }
    req.auth = user;
    next();
};