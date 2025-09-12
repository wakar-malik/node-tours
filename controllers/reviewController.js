const Review = require("../model/reviewModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, createOne, updateOne, getOne } = require("./handlerFactory");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.params.tourId) filter.tour = req.params.tourId;

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
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

exports.setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.currentUser.id;

  next();
};

exports.getReview = getOne(Review);
exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
