const express = require("express");
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  getMyTours,
} = require("../controllers/viewController");
const { protect, isLoggedIn } = require("../controllers/authController");

const router = express.Router();

router.use((req, res, next) => {
  const { alert } = req.query;

  if (alert) {
    req.locals.alert = alert;
  }
  next();
});

router.route("/").get(isLoggedIn, getOverview);
router.route("/tour/:slug").get(isLoggedIn, getTour);
router.route("/login").get(isLoggedIn, getLoginForm);
router.route("/me").get(protect, getAccount);
router.route("/my-tours").get(protect, getMyTours);

module.exports = router;
