const Tour = require("../modal/tourModal");
const ApiFeatures = require("../utils/apiFeatures");

exports.getAllTours = async (req, res) => {
  const tourQuery = Tour.find().filterQuery();

  // const { query } = new ApiFeatures(tourQuery, req.query)
  //   .filter()
  //   .sort()
  //   .limitFields()
  //   .paginate();

  const tours = await tourQuery;

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

exports.getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);

    res.status(201).json({
      status: "success",
      data: { tour: tour },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    tour.name = "=====";
    await tour.save();

    res.status(201).json({
      status: "success",
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  const { id } = req.params;

  try {
    await Tour.findByIdAndDelete(id);

    res.status(201).json({
      status: "success",
      message: "tour deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
      data: { stats },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
