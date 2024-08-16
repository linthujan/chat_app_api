const AppError = require("./AppError");
const { STATUS_CODE, NO_PARAMS } = require("./constants");
// const { NO_PARAMS, OWNER_ONLY_ACTION } = require("./errorMessage");
// const { STATUS_CODE } = require("./utility");

// common types
/**
 * 
 * @typedef {import("sequelize").Model} Model 
 * @typedef {import("sequelize").WhereOptions} WhereOptions 
 * @typedef {import("sequelize").FindOptions} FindOptions 
 * @typedef {import("./AppError")} AppError 
 * @typedef {import("./utility")} STATUS_CODE 
 */

// function parameter types
/**
 * @typedef {Object} FindModelAndThrowConfig
 * @property {string} [messageOnFound]
 * @property {string} [messageOnDeleted]
 * @property {boolean} [throwOnDeleted]
*/

/**
 * @typedef {Object} FindModelOrThrowConfig
 * @property {string} [messageOnNotFound]
 * @property {string} [messageOnDeleted]
 * @property {boolean} [throwOnDeleted]
 */


module.exports.validateNullParameters = (parameters = []) => {
    console.log(`parameters`, parameters);

    if (parameters.length == 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }
    const notValids = parameters.filter((parameter) => {
        return (parameter == null ||
            parameter == undefined ||
            (
                typeof parameter == 'string' &&
                (
                    parameter == "" ||
                    parameter == "undefined" ||
                    parameter == "null"
                )
            )
        )
    })
    if (notValids.length != 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST, { notValids });
    }

    return true;
}

module.exports.validateEmptyStringParameters = (parameters = []) => {
    if (parameters.length == 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }

    const notValids = parameters.filter((parameter) => ((parameter != null || parameter != undefined) &&
        (typeof parameter == 'string' &&
            parameter == "" &&
            parameter == "undefined" &&
            parameter == "null")));
    if (notValids.length != 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }

    return true;
}

module.exports.validateEmptyArrayParameters = (parameters = []) => {
    if (parameters.length == 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }

    const notValids = parameters.filter((parameter) => ((parameter != null || parameter != undefined) && !(Array.isArray(parameter) && parameter.length > 0)));
    if (notValids.length != 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }

    return true;
}

module.exports.validateTrue = (parameter) => {
    if (!parameter) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }

    return true;
}

module.exports.validateAuthority = (user_id, owner_id) => {
    if (owner_id != user_id) {
        throw new AppError(OWNER_ONLY_ACTION, STATUS_CODE.FORBIDDEN);
    }

    return true;
}

/**
 * 
 * @param {import("sequelize").WhereOptions<any>} finder
 * @param {(typeof import("sequelize").Model)} FindModel
 * @param {import("sequelize").FindOptions} options
 * @param {FindModelAndThrowConfig} findModelAndThrowConfig
 * @returns 
 */
module.exports.findModelAndThrow = async (finder, FindModel, options = {}, findModelAndThrowConfig) => {
    const defaultConfig = {
        throwOnDeleted: false,
        messageOnFound: `${FindModel.name} already exist`,
        messageOnDeleted: `${FindModel.name} is deleted`,
    }
    const config = { ...defaultConfig, ...findModelAndThrowConfig };

    const model = await FindModel.findOne({
        where: finder,
        paranoid: false,
        ...options,
    })
    if (FindModel.options.paranoid && model?.isSoftDeleted() && config.throwOnDeleted) {
        throw new AppError(config.messageOnDeleted, STATUS_CODE.BAD_REQUEST);
    }
    if (model) {
        throw new AppError(config.messageOnFound, STATUS_CODE.BAD_REQUEST);
    }
    return;
}

/**
 * @template T
 * @param {WhereOptions} finder
 * @param {new () => T} FindModel
 * @param {FindOptions} options
 * @param {FindModelOrThrowConfig} findModelOrThrowConfig
 * @returns {Promise<T>}
 * @throws {AppError}
*/
module.exports.findModelOrThrow = async (finder, FindModel, options = {}, findModelOrThrowConfig) => {
    const defaultConfig = {
        throwOnDeleted: false,
        messageOnNotFound: `${FindModel.name} already exist`,
        messageOnDeleted: `${FindModel.name} is deleted`,
    }
    const config = { ...defaultConfig, ...findModelOrThrowConfig };

    /** @type {T | null} */
    const model = await FindModel.findOne({
        where: finder,
        paranoid: false,
        ...options,
    })

    if (!model) {
        throw new AppError(config.messageOnNotFound, STATUS_CODE.NOT_FOUND);
    }

    if (FindModel.options.paranoid && model?.isSoftDeleted() && config.throwOnDeleted) {
        throw new AppError(config.messageOnDeleted, STATUS_CODE.NOT_FOUND);
    }

    return model;
}

/**
 *
 * @param {[[import("sequelize").WhereOptions<any>,(typeof import("sequelize").Model)]]} findOptions
 * @returns
*/
module.exports.findModelsAndThrow = async (findOptions = []) => {
    for (let i = 0; i < findOptions.length; i++) {
        const [finder, Model] = findOptions[i];
        const model = await Model.findOne({
            where: finder,
            paranoid: false,
        })
        if (model) {
            throw new AppError(`${Model.name} already exist`, STATUS_CODE.NOT_FOUND);
        }
    }
    return null;
}
/**
 * 
 * @param {[[import("sequelize").WhereOptions<any>,(typeof import("sequelize").Model),import("sequelize").FindOptions]]} findOptions 
 * @returns 
 */
module.exports.findModelsOrThrow = async (findOptions = []) => {
    const models = {};
    for (let i = 0; i < findOptions.length; i++) {
        const [finder, Model, options] = findOptions[i];
        const model = await Model.findOne({
            where: finder,
            ...options,
        })

        if (!model) {
            throw new AppError(`${Model.name} not exist`, STATUS_CODE.NOT_FOUND);
        }
        let modelName = Model.name;
        modelName = modelName[0].toLowerCase() + modelName.slice(1);
        models[modelName] = model;
    }
    return models;
}