const express = require("express");

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  // topTours,
} = require("../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// /:tourId/review will use reviewRouter
router.use("/:tourId/reviews", reviewRouter);

// router.route("/top-5-tours").get(topTours, getAllTours);

router.route("/tour-stats").get(getTourStats);
router.route("/get-monthly-plan/:year").get(getMonthlyPlan);

router.route("/").get(protect, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guid"), deleteTour);

// router
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("user"), createReview);

module.exports = router;
