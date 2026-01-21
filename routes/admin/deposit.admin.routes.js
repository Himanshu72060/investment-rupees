const express = require("express");
const router = express.Router();

const {
    approveDeposit,
    updateDepositStatus,
    rejectDeposit,
    getAllDeposits
} = require("../../controllers/admin/deposit.admin.controller");

const adminMiddleware = require("../../middleware/admin.middleware");

// ✅ ADMIN APIs
router.get("/deposit/deposits", adminMiddleware, getAllDeposits);
router.put("/deposit/update-status/:id", adminMiddleware, updateDepositStatus);
router.put("/deposit/reject/:id", adminMiddleware, rejectDeposit);
router.put("/deposit/approve/:id", adminMiddleware, approveDeposit);

module.exports = router;
