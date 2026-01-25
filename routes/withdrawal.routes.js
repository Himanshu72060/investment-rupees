const express = require("express");
const router = express.Router();

const {
    createWithdrawal,
    getMyWithdrawals,
    getAllWithdrawals,
    updateWithdrawalStatus
} = require("../controllers/withdrawal.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/request", authMiddleware, createWithdrawal);
router.get("/my", authMiddleware, getMyWithdrawals);
router.get("/all", authMiddleware, getAllWithdrawals);
router.put("/update-status/:id", authMiddleware, updateWithdrawalStatus);

module.exports = router;
