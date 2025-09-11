const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { deleteOne, updateOne } = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async function (req, res) {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    size: users.length,
    data: { users },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if use post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. please use /updateMyPassword",
        400
      )
    );
  }

  // 2) Update user document
  const filteredBody = filterObj(req.body, "name", "email");
  console.log(filteredBody);

  const updatedUser = await User.findByIdAndUpdate(
    req.currentUser.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.currentUser.id, { active: false });

  res.status(204).json({ status: "success", data: null });
});

exports.getUser = function (req, res) {
  res.send(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

exports.createUser = function (req, res) {
  res.send(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

exports.updateUser = function (req, res) {
  res.send(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
