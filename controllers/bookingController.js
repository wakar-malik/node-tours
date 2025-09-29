const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../model/tourModel");
const Booking = require("../model/bookingModel");
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
  console.log(tour);

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
    success_url: `${req.protocol}://${req.get("host")}/?tour=${
      req.params.tourId
    }&user=${req.currentUser.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.currentUser.email,
    client_reference_id: req.params.tourID,
    mode: "payment",
  });

  console.log(session);

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is temporary
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});

exports.createBooking = createOne(Booking);
exports.getAllBookings = getAll(Booking);
exports.getBooking = getOne(Booking);
exports.updateBooking = updateOne(Booking);
exports.deleteBooking = deleteOne(Booking);
