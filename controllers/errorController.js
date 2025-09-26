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

const handleJWTError = () =>
  new AppError("Invalid token, please log in again!", 401);

const handleJWTExpError = () =>
  new AppError("Token expired, please log in again!", 401);

function sendErrorDev(err, req, res) {
  // A) API Error
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) website error template
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
}

function sendErrorProd(err, req, res) {
  // A) API error
  if (req.originalUrl.startsWith("/api")) {
    // OPERATIONAL, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // PROGRAMMING or other unknown error: don't leak error details
    return res.status(err.statusCode).json({
      status: "error",
      message: "Something went wrong!",
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }

  // PROGRAMMING or other unknown error: don't leak error details
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later",
  });
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") error = handleCasteError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);
    if (err.errorResponse?.code === 11000) error = handleDubKeyError(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError(err);
    if (err.name === "TokenExpiredError") error = handleJWTExpError(err);

    sendErrorProd(error, req, res);
  }
};
