const AppError = require('./../utils/appError');

const errorDev = (error, response) => {
    response.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
      });
}

const errorProduction = (error, response) => {
    if (error.isOperational) {
        response.status(error.statusCode).json({
            status: error.status, 
            message: error.message
        })
    } else {
        response.status(500).json({
            status: error.status,
            message: 'Something went wrong'
        })
    }
}


exports.errorHandler = (error, request, response, next) => {
    error.status = error.status || "error";
    error.statusCode = error.statusCode || 500;
    if (process.env.NODE_ENV === "development") {
        errorDev(error, response);
      } else if (process.env.NODE_ENV === "production") {
        let err = { ...error }
        if (error.name === 'CastError') {
            err = handleCastError(error);
        } 
        if (error.name === 'ValidationError') {
            err = handleValidationError(error);
        } 
        if (error.code === 11000) {
            err = handleDuplicateError(error);
        }
        errorProduction(err, response);
      };
};


const handleCastError = (error) => {
    error.message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(400, message);
}

const handleValidationError = (error) => {
    const errors = Object.values(error.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`
    return new AppError(400, message);
}

const handleDuplicateError = (error) => {
    const value = error.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    const message = `Duplicate field value: ${value[0]}, please try again with different value`;
    return new AppError(400, message);
}

exports.notFound = (request, response, next) => {
    next(new AppError(404, 'URL not found'))
};

exports.catchAsync = (func) => {
    return (request, response, next) => func(request, response, next).catch(next);
}