const { sequelize } = require("../models");
const paginationHandler = require("./paginationHandler");

/**
 * ygjhghgh
 * @param {(
 *  req: Request,
 *  res: Response, 
 *  extras: {
 *      next:import("express").NextFunction,
 *      transaction:import("sequelize").Transaction,
 *      pagination:any,
 *      pageData:any,
 * }) => Promise<void>} apiController yguyg
 * @param {Boolean} useTransaction ggjhgjg
 * @returns kgh
 */
module.exports = (apiController, useTransaction = true) => {
    return async (req, res, next) => {
        const { pagination, pageData } = paginationHandler(req);
        let transaction;
        let errorCallback = null;
        const setErrorCallback = (callback) => { errorCallback = callback };

        if (useTransaction) {
            transaction = await sequelize.transaction();
        }

        const extras = {
            next,
            transaction,
            pagination,
            pageData,
            setErrorCallback,
        };

        try {
            await apiController(req, res, extras);
            if (useTransaction && !transaction.finished) {
                await transaction.rollback();
            }
        } catch (error) {
            if (errorCallback) {
                await errorCallback();
            }
            if (useTransaction && !transaction.finished) {
                await transaction.rollback().finally(() => next(error));
            }
            else {
                next(error);
            }
        }
    }
}