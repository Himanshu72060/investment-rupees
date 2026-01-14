const express = require("express");
const router = express.Router();

const {
    getAllDeposits,
    approveDeposit,
    rejectDeposit
} = require("../../controllers/admin/deposit.admin.controller");

const adminMiddleware = require("../../middleware/admin.middleware");

// ✅ GET ALL DEPOSITS
router.get("/all", adminMiddleware, getAllDeposits);

// ✅ APPROVE DEPOSIT
router.put("/approve/:depositId", adminMiddleware, approveDeposit);

// ❌ REJECT DEPOSIT
router.put("/reject/:depositId", adminMiddleware, rejectDeposit);

module.exports = router;
