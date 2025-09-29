const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../model/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked session
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
          },
          unit_amount: tour.price,
        },
        quantity: 1,
      },
    ],
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.currentUser.email,
    client_reference_id: req.params.tourID,
    mode: "payment",
  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});
