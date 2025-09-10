const Review = require("../model/reviewModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("No review found with this id", 404));
  }

  res.status(200).json({
    status: "success",
    review,
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.currentUser.id;

  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: "success",
    data: { review: newReview },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!review) {
    return next(new AppError("No review found with this id", 404));
  }

  res.status(200).json({
    status: "success",
    message: "review updated successfully",
    review,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError("No review found with this id", 404));
  }

  res.status(200).json({
    status: "success",
    message: "review deleted successfully",
  });
});
