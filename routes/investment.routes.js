const express = require("express");
const router = express.Router();

const {
  createInvestment,
  getMyInvestments,
  getInvestmentSummary
} = require("../controllers/investment.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/deposit", authMiddleware, createInvestment);
router.get("/my", authMiddleware, getMyInvestments);
router.get("/summary", authMiddleware, getInvestmentSummary);

module.exports = router;
