const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// CREATE
exports.createOne = (Model, name) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
};

// READ ONE
exports.getOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id).populate("reviews");

    if (!doc) {
      return next(new AppError("No document found with this ID", 404));
    }

    res.status(201).json({
      status: "success",
      data: {
        data: tour,
      },
    });
  });
};

// UPDATE
exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with this ID", 404));
    }

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
};

// DELETE
exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with this ID", 404));
    }

    res.status(201).json({
      status: "success",
      message: "Doc deleted successfully",
    });
  });
};
