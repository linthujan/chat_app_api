const { User } = require("../../models");
const AppError = require("../AppError");
const { STATUS_CODE } = require("../constants");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("Invalid authorization header", STATUS_CODE.UNAUTHORIZED));
    }

    const token = authHeader.split(" ").pop();
    if (!token) {
        return next(new AppError("Authorization token not found", STATUS_CODE.UNAUTHORIZED));
    }

    try {
        console.log(token);
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`payload`, payload);

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
    } catch (error) {
        console.log(error);
        next(new AppError(error.name, STATUS_CODE.UNAUTHORIZED));
    }
};