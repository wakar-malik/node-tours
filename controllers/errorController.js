const AppError = require("../utils/appError");

function handleValidationError(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  let message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
}

function handleCasteError(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

function handleDubKeyError(err) {
  const value = err.errorResponse.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate key for ${value}. please use another.`;
  return new AppError(message, 400);
}

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  // OPERATIONAL, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // PROGRAMMING or other unknown error: don't leak error details
  } else {
    res.status(err.statusCode).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") error = handleCasteError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);
    if (err.errorResponse?.code === 11000) error = handleDubKeyError(err);

    sendErrorProd(error, res);
  }
};
