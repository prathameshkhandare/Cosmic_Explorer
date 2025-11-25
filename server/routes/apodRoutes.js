// routes/apodRoutes.js
const express = require("express");
const router = express.Router();

const {
  getTodayOrByDate,
  getRange,
  getRecent
} = require("../controllers/apodController");

router.get("/", getTodayOrByDate);             // /api/apod?date=2024-01-01
router.get("/range", getRange);                // /api/apod/range?start=...&end=...
router.get("/recent", getRecent);              // /api/apod/recent?count=10

module.exports = router;
