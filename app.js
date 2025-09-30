const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
var hpp = require("hpp");
const errorControlHandler = require("./controllers/errorController");
const path = require("path");
const cookieParser = require("cookie-parser");
const compression = require("compression");

// routes
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const bookingRouter = require("./routes/bookingRoutes");

const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour.",
});

const app = express();

app.get("/health", (req, res, next) => res.send("OK"));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "https://js.stripe.com"],
      scriptSrc: [
        "'self'",
        "https://unpkg.com",
        "https://js.stripe.com", // allow stripe scripts
      ],
      frameSrc: [
        "'self'",
        "https://js.stripe.com", // allow Stripe iframes (important for Checkout/Elements)
      ],
      connectSrc: [
        "'self'",
        "https://unpkg.com",
        "https://js.stripe.com", // Stripe APIs
        "https://api.stripe.com",
      ], // allow map fetch
    },
  })
);

app.use(compression());
app.use(limiter);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.set("query parser", "extended");

app.use((req, res, next) => {
  // sanitize body e.g {email:"<script>something</script>"} to {email:"&lt;div&lt;something&lt;/div&lt;"} removes <,> symbols from req.body with html entity codes.
  // XSS sanitize body (mutate values instead of replacing object)
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  // XSS sanitize query (mutate values instead of replacing object)
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = xss(req.query[key]);
      }
    }
  }

  // XSS sanitize params
  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === "string") {
        req.params[key] = xss(req.params[key]);
      }
    }
  }

  // sanitize body e.g {email:"<div>something</div>"} to {email:"&lt;div&lt;something&lt;/div&lt;"} removes <,> symbols from req.body with html entity codes.
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  mongoSanitize.sanitize(req.query);

  next();
});

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// API End Points
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.use((req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorControlHandler);
module.exports = app;
