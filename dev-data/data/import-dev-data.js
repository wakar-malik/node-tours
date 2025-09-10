const mongoose = require("mongoose");
const Tour = require("../../model/tourModel");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: "../../.env" });
console.log(process.env.DB_URL);
const DB = process.env.DB_URL.replace("<db_password>", process.env.DB_PASS);

mongoose
  .connect(DB, { dbName: "node-tours" })
  .then((connection) => console.log("connected to database 🟢"))
  .catch((err) => console.log("failed to connect to database 🔴", err.message));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

async function importData() {
  try {
    await Tour.create(tours);
    console.log("Data imported successfully 🟢");
  } catch (error) {
    console.log("failed to import data 🔴", error.message);
  }
}

async function deleteData() {
  try {
    await Tour.deleteMany({});
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
