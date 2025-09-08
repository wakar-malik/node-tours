const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 🔥 Shutting down 🔴");
  console.log(err.name, err.message);

  // it immediately terminate the node js process without processing pending requests, no need to use server.close() because uncaughtExceptions happens synchronously.
  process.exit(1);
});

dotenv.config({ path: "./.env", quiet: true });
const app = require("./app");
const DB = process.env.DB_URL.replace("<db_password>", process.env.DB_PASS);

mongoose
  .connect(DB, { dbName: "node-tours" })
  .then((connection) => console.log("connected to database 🟢"))
  .catch((err) => console.log("failed to connect to database 🔴", err.message));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`server is listening at ${PORT} 🟢`)
);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 🔥 Shutting down 🔴");
  console.log(err.name, err.message);

  // process all pending requests before closing the server
  server.close(() => {
    // it immediately terminate the node js process without processing pending requests, use with server.close()
    process.exit(1);
  });
});
