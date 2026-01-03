const express = require("express");
const router = express.Router();

const {
    createInvestment,
    getMyInvestments,
    getInvestmentSummary,
    createDeposit
} = require("../controllers/investment.controller");

const authMiddleware = require("../middleware/auth.middleware");

/*
  POST  /api/investment/create
  GET   /api/investment/my
  GET   /api/investment/summary
*/

router.post("/create", authMiddleware, createInvestment);
router.get("/my", authMiddleware, getMyInvestments);
router.get("/summary", authMiddleware, getInvestmentSummary);
router.post("/deposit", authMiddleware, createDeposit);

module.exports = router;
