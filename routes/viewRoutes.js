const express = require("express");
const { getOverview, getTour } = require("../controllers/viewController");

const router = express.Router();

router.route("/").get(getOverview);
router.route("/tour/:slug").get(getTour);

module.exports = router;
