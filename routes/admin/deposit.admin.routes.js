const express = require("express");
const router = express.Router();

const {
    approveDeposit,
    getAllDeposits
} = require("../../controllers/admin/deposit.admin.controller");

const adminMiddleware = require("../../middleware/admin.middleware");

// 🔥 ADMIN → GET ALL DEPOSITS
router.get("/deposit/deposits", adminMiddleware, getAllDeposits);

// 🔥 ADMIN → APPROVE DEPOSIT
router.put("/deposit/approve/:id", adminMiddleware, approveDeposit);

module.exports = router;
