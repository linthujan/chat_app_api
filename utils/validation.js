const AppError = require("./AppError");
const { STATUS_CODE, NO_PARAMS } = require("./constants");

module.exports.isNullParameters = (parameters = []) => {
    if (parameters.length == 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }
    console.log(parameters);
    const notValids = parameters.filter((parameter) => {
        return (parameter == null ||
            parameter == undefined ||
            (typeof parameter == 'string' &&
                (parameter == "" ||
                    parameter == "undefined" ||
                    parameter == "null")
            )
        )
    })
    console.log(notValids);
    if (notValids.length != 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }
}

module.exports.isEmptyStringParameters = (parameters = []) => {
    if (parameters.length == 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }

    const notValids = parameters.filter((parameter) => ((parameter != null || parameter != undefined) && (typeof parameter == 'string' && parameter == "" && parameter == "undefined" && parameter == "null")));
    if (notValids.length != 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }
}

module.exports.isEmptyArrayParameters = (parameters = []) => {
    if (parameters.length == 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }

    const notValids = parameters.filter((parameter) => ((parameter != null || parameter != undefined) && !(Array.isArray(parameter) && parameter.length > 0)));
    if (notValids.length != 0) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }
}

module.exports.validateTrue = (parameter) => {
    if (!parameter) {
        throw new AppError(NO_PARAMS, STATUS_CODE.BAD_REQUEST);
    }

    return true;
}

/**
 * 
 * @param {import("sequelize").WhereOptions<any>} finder 
 * @param {import("sequelize").Model} Model 
 * @param {import("sequelize").FindOptions} options 
 * @returns 
 */
module.exports.findModelAndThrow = async (finder, Model, options = {}) => {
    const model = await Model.findOne({
        where: finder,
        paranoid: false,
        ...options,
    })
    if (model) {
        throw new AppError(`${Model.name} already exist`, STATUS_CODE.BAD_REQUEST);
    }
    return null;
}
/**
 * 
 * @param {import("sequelize").WhereOptions<any>} finder 
 * @param {import("sequelize").Model} Model 
 * @param {import("sequelize").FindOptions} options 
 * @returns {Promise<Model>}
*/
module.exports.findModelOrThrow = async (finder, Model, options = {}) => {
    const model = await Model.findOne({
        where: finder,
        ...options,
    })
    if (!model) {
        throw new AppError(`${Model.name} not exist`, STATUS_CODE.NOT_FOUND);
    }
    return model;
}

/**
 * 
 * @param {[[import("sequelize").WhereOptions<any>,import("sequelize").Model]]} findOptions 
 * @returns 
*/
module.exports.findModelsAndThrow = async (findOptions = []) => {
    for (let i = 0; i < findOptions.length; i++) {
        const [finder, Model] = findOptions[i];
        console.log(finder);
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
 * @param {[[import("sequelize").WhereOptions<any>,import("sequelize").Model,import("sequelize").FindOptions]]} findOptions 
 * @returns 
 */
module.exports.findModelsOrThrow = async (findOptions = []) => {
    const models = {};
    for (let i = 0; i < findOptions.length; i++) {
        const [finder, Model, options] = findOptions[i];
        console.log(finder);
        const model = await Model.findOne({
            where: finder,
            ...options,
        })
        // console.log(model);  
        if (!model) {
            console.log("not");
            throw new AppError(`${Model.name} not exist`, STATUS_CODE.NOT_FOUND);
        }
        let modelName = Model.name;
        console.log(modelName);
        modelName = modelName[0].toLowerCase() + modelName.slice(1);
        console.log({ modelName });
        models[modelName] = model;
    }
    return models;
}