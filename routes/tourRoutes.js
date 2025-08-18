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

const router = express.Router();

// router.route("/top-5-tours").get(topTours, getAllTours);

router.route("/tour-stats").get(getTourStats);
router.route("/get-monthly-plan/:year").get(getMonthlyPlan);

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
