const express = require("express");
const { getOverview, getTour } = require("../controllers/viewController");

const router = express.Router();

router.route("/overview").get(getOverview);
router.route("/tour").get(getTour);

module.exports = router;
