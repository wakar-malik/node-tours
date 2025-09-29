const express = require("express");

const {
  getCheckoutSession,
  getAllBookings,
  createBooking,
  getBooking,
  deleteBooking,
  updateBooking,
} = require("../controllers/bookingController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.use(protect);
router.route("/checkout-session/:tourId").get(getCheckoutSession);

router.use(restrictTo("admin", "lead-guide"));

router.route("/").get(getAllBookings).post(createBooking);

router.route("/:id").get(getBooking).delete(deleteBooking).patch(updateBooking);

module.exports = router;
