const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

// routes
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
dotenv.config({ path: "./.env" });
app.set("query parser", "extended");

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.use((req, res) => {
  res.send(`this ${req.url} is not defined`);
});

module.exports = app;
