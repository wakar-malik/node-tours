const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
const PORT = 3000;

const userRoutes = express.Router();

const getAllUsers = function (req, res, next) {
  res.json({ message: "All Users Received" });
};

const deleteUser = function (req, res, next) {
  const { id } = req.params;
  const { name, last } = req.query;

  console.log(id, name, last);
  res.json({ message: `User Deleted ${id}` });
};

userRoutes.route("/").get(getAllUsers);
userRoutes.route("/:id").delete(deleteUser);

app.get("/", (req, res) => {
  res
    .status(200)
    .set({ "Content-type": "application/json", "custom-header": "wakar-malik" })
    .json({ message: "from server" });
});

app.use("/api/v1/user", userRoutes);

app.listen(PORT, () => console.log(`server is listening at ${PORT}.....`));
