const express = require("express");
const router = express.Router();

const { approveDeposit } = require("../../controllers/admin/deposit.admin.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");

// ADMIN → APPROVE DEPOSIT
router.post(
    "/deposit/approve/:depositId",
    authMiddleware,
    adminMiddleware,
    approveDeposit
);

module.exports = router;
