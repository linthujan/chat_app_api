class AppError extends Error {
    /**
     * 
     * @param {String} message 
     * @param {Number} statusCode 
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = false;
        this.isAppError = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;

/**
 * 
 * @param {{transaction:import("sequelize").Transaction,next:import("express").NextFunction}} extras 
 * @param {String} message 
 * @param {Number} statusCode 
 * @returns 
 */
module.exports.sendAppError = (extras, message, statusCode) => {
    if (extras.transaction) {
        return extras.transaction.rollback().finally(() => extras.next(new AppError(message, statusCode)));
    }
    else {
        return extras.next(new AppError(message, statusCode));
    }
}