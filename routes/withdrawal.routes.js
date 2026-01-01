const express = require("express");
const router = express.Router();

const {
    createWithdrawal,
    getMyWithdrawals
} = require("../controllers/withdrawal.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/request", authMiddleware, createWithdrawal);
router.get("/my", authMiddleware, getMyWithdrawals);

module.exports = router;
