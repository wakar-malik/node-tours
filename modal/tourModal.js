const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      trim: true,
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    discount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now,
    },
    startDates: [Date],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    autoIndex: true,
    validateBeforeSave: false,
    optimisticConcurrency: true,
    timeseries: {
      timeField: "timestamp",
      metaField: "metadata",
      granularity: "hours",
    },
    timestamps: {
      createdAt: "created_at",
    },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return Math.ceil(this.duration / 7);
});

const Tour = mongoose.model("tours", tourSchema);

module.exports = Tour;

// tourSchema.methods.getName = function () {
//   console.log(this.name);
// };

// tourSchema.statics.getName = function () {
//   return this.findById("68a0afabf16568e601722d55");
// };
// Tour.getName().then((tour) => {
//   console.log(tour.name);
// });

// tourSchema.query.filterQuery = function () {
//   return this.where({ price: { $lt: 400 } });
// };

// tourSchema.virtual("durationWeeks").set(function (v) {
//   return (this.name = v);
// });
