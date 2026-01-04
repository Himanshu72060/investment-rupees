const express = require("express");
const router = express.Router();

const {
  createDeposit,
  getMyInvestments,
  getInvestmentSummary
} = require("../controllers/investment.controller");

const authMiddleware = require("../middleware/auth.middleware");

/*
  POST  /api/investment/deposit
  GET   /api/investment/my
  GET   /api/investment/summary
*/

router.post("/deposit", authMiddleware, createDeposit);
router.get("/my", authMiddleware, getMyInvestments);
router.get("/summary", authMiddleware, getInvestmentSummary);

module.exports = router;
