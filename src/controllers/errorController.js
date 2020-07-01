const AppError = require('./../utils/appError');

const errorDev = (error, response) => {
    response.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
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
        errorDev(error, res);
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
      };
};


const handleCastError = (error) => {

}

const handleValidationError = (error) => {

}

const handleDuplicateError = (error) => {

}

exports.notFound = (request, response, next) => {
    next(new AppError(404, 'URL not found'))
};

exports.catchAsync = func => {
    return (request, response, next) => func(request, response, next).catch(next);
}