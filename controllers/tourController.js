const Tour = require("../model/tourModel");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { deleteOne, createOne, updateOne } = require("./handlerFactory");

exports.getAllTours = catchAsync(async (req, res, next) => {
  const tourQuery = Tour.find();

  const { query } = new ApiFeatures(tourQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await query;

  res.status(200).json({
    status: "success",
    size: tours.length,
    data: { tour: tours },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id).populate("reviews");

  if (!tour) {
    return next(new AppError("No tour found with this ID", 404));
  }

  res.status(201).json({
    status: "success",
    data: { tour: tour },
  });
});

exports.deleteTour = deleteOne(Tour);
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRating: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res.status(200).json({
    message: "success",
    size: stats.length,
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const monthlyPlan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    { $project: { startDate: { $toDate: "$startDates" }, name: "$name" } },
    {
      $match: {
        startDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDate" },
        numToursStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    { $addFields: { month: "$_id" } },
    { $project: { _id: 0 } },
    { $sort: { numToursStarts: -1 } },
  ]);

  res.status(200).json({
    message: "success",
    size: monthlyPlan.length,
    data: { monthlyPlan },
  });
});
