const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../model/tourModel");
const User = require("../model/userModel");
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
    success_url: `${req.protocol}://${req.get("host")}/my-tours`,
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

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
// // This is temporary
//   const { tour, user, price } = req.query;
//   if (!tour && !user && !price) return next();
//   await Booking.create({ tour, user, price });
//   res.redirect(req.originalUrl.split("?")[0]);
// });

async function createBookingCheckout(session) {
  console.log(session);
  console.log("executing 2.....");
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  // const price = session.data[0].price_data.unit_amount
  const price = 100;
  await Booking.create({ tour, user, price });
}

exports.webHookCheckout = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true, event, eventType: event.type });
};

exports.createBooking = createOne(Booking);
exports.getAllBookings = getAll(Booking);
exports.getBooking = getOne(Booking);
exports.updateBooking = updateOne(Booking);
exports.deleteBooking = deleteOne(Booking);
