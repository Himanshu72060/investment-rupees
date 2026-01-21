const express = require("express");
const router = express.Router();

const {
    getAllDeposits,
    approveDeposit,
    rejectDeposit,
    updateDepositStatus
} = require("../../controllers/admin/deposit.admin.controller");

const adminMiddleware = require("../../middleware/admin.middleware");
const authMiddleware = require("../../middleware/auth.middleware");

// ✅ GET ALL DEPOSITS
router.get("/all", authMiddleware, adminMiddleware, getAllDeposits);

// ✅ APPROVE DEPOSIT
router.put("/approve/:depositId", authMiddleware, adminMiddleware, approveDeposit);

// ❌ REJECT DEPOSIT
router.put("/reject/:depositId", authMiddleware, adminMiddleware, rejectDeposit);

// ✅ UPDATE DEPOSIT STATUS (PENDING → APPROVED/REJECTED) WITH NOTIFICATION
router.put("/status/:depositId", authMiddleware, adminMiddleware, updateDepositStatus);

module.exports = router;
