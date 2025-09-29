const express = require("express");

const { getCheckoutSession } = require("../controllers/bookingController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.route("/checkout-session/:tourId").get(protect, getCheckoutSession);

module.exports = router;
