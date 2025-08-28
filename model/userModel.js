const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please tell use your name"],
  },
  email: {
    type: String,
    require: [true, "Please tell use your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  phone: String,
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength: [8, "Password should be more or equal to 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, "Please confirm you password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Please confirm your password",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (userPass, dbPass) {
  const value = await bcrypt.compare(userPass, dbPass);
  return value;
};

userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < passwordChangedTimeStamp;
  }

  return false;
};

const User = mongoose.model("users", userSchema);
module.exports = User;
