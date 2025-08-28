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

const router = express.Router();

// router.route("/top-5-tours").get(topTours, getAllTours);

router.route("/tour-stats").get(getTourStats);
router.route("/get-monthly-plan/:year").get(getMonthlyPlan);

router.route("/").get(protect, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guid"), deleteTour);

module.exports = router;
