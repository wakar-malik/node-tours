const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    String,
    required: [true, "Name is required!"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
});

const Tour = mongoose.Model("tours", tourSchema);

module.exports = Tour;
