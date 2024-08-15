/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
module.exports = (req, res, next) => {
    /**
     * 
     * @param {Object} data 
     * @param {Object} meta 
     */
    res.sendRes = (data, meta) => {
        const length = data && Array.isArray(data) && data.length || undefined;
        res.status(meta.status || 200).send({
            status: true,
            length,
            meta,
            data,
        });
    }
    next();
}