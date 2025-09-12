const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

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
exports.getOne = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) {
      query = query.populate(popOptions);
    }

    const doc = await query;

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

// READ ALL
exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const { query } = new ApiFeatures(Model.find(), req.query)
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
