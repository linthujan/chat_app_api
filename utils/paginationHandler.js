/**
 * 
 * @param {import("express").Request} req 
 */
module.exports = (req) => {
    let { page = 1, size } = req.query;

    page = parseInt(page - 1);
    size = parseInt(size);

    if ((page == null && size == null) || isNaN(page) || isNaN(size)) {
        return {
            pagination: null,
            pageData: null,
        }
    }

    const offset = page * size;
    return {
        pagination: {
            limit: size,
            offset: offset,
        },
        pageData: {
            page,
            size,
        },
    }
}