module.exports = (apiController) => {
    return async (req, res, next) => {
        try {
            await apiController(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}