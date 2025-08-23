const Tour = require("../modal/tourModal");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllTours = async (req, res, next) => {
  const tourQuery = Tour.find();

  const { query } = new ApiFeatures(tourQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await query;

  try {
    res.status(200).json({
      status: "success",
      size: tours.length,
      data: { tour: tours },
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError("No tour found with this ID", 404));
  }

  res.status(201).json({
    status: "success",
    data: { tour: tour },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: { tour: newTour },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError("No tour found with this ID", 404));
  }

  await tour.save();

  res.status(201).json({
    status: "success",
    data: { tour },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new AppError("No tour found with this ID", 404));
  }

  res.status(201).json({
    status: "success",
    message: "tour deleted successfully",
  });
});

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
