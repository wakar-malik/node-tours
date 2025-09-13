const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const Tour = require("../../model/tourModel");
const User = require("../../model/userModel");
const Review = require("../../model/reviewModel");

dotenv.config({ path: "../../.env" });
const DB = process.env.DB_URL.replace("<db_password>", process.env.DB_PASS);

mongoose
  .connect(DB, { dbName: "node-tours" })
  .then((connection) => console.log("connected to database 🟢"))
  .catch((err) => console.log("failed to connect to database 🔴", err.message));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

async function importData() {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log("Data imported successfully 🟢");
  } catch (error) {
    console.log("failed to import data 🔴", error.message);
  }
}

async function deleteData() {
  try {
    await Tour.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});

    console.log("Data deleted successfully 🟢");
  } catch (error) {
    console.log("failed to delete data 🔴", error.message);
  }
}

if (process.argv[2] == "upload") {
  importData();
} else if (process.argv[2] == "delete") {
  deleteData();
}
