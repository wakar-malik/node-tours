const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const errorControlHandler = require("./controllers/errorController");
// routes
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const errorController = require("./controllers/errorController");

const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.set("query parser", "extended");

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.use((req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorControlHandler);

module.exports = app;
