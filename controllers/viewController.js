const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  res.status(200).render("overview", {
    title: "All Tours",
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  res.status(200).render("tour", {
    title: "The Forest Hiker Tour",
  });
});
