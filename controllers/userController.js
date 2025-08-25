const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async function (req, res) {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    size: users.length,
    data: { users },
  });
});

exports.getUser = function (req, res) {};
exports.createUser = function (req, res) {};
exports.updateUser = function (req, res) {};
exports.deleteUser = function (req, res) {};
