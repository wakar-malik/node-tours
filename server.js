const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;

const DB = process.env.DB_URL.replace("<db_password>", process.env.DB_PASS);

mongoose
  .connect(DB, { dbName: "node-tours" })
  .then((connection) => console.log("connected to database 🟢"))
  .catch((err) => console.log("failed to connect to database 🔴", err.message));

app.listen(PORT, () => console.log(`server is listening at ${PORT}.....`));
