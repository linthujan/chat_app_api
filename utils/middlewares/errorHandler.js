const errorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    console.log(error);
    // error.status = error.status || "error";

    if (process.env.NODE_ENV === "production") {
        productionError(res, error);
    }
    else {
        developmentError(res, error);
    }
};

function productionError(res, error) {
    if (error.isAppError) {
        res.status(error.statusCode).json({
            status: false,
            meta: {
                message: error.message,
            },
        });
    }
    else {
        res.status(500).json({
            status: false,
            meta: {
                message: "INTERNAL SERVER ERROR",
            },
        });
    }
}

function developmentError(res, error) {
    res.status(error.statusCode).json({
        status: false,
        meta: {
            message: error.message,
        },
        error: error,
        errorStack: error.stack,
    });
}

module.exports = errorHandler;