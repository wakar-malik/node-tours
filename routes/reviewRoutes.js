const express = require("express");

const {
  getAllReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview,
  setTourAndUserIds,
} = require("../controllers/reviewController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), setTourAndUserIds, createReview);

router.route("/:id").get(getReview).delete(deleteReview).patch(updateReview);

module.exports = router;
