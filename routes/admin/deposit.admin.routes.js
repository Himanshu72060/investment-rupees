const express = require("express");
const router = express.Router();

const {
    getAllDeposits,
    approveDeposit,
    rejectDeposit
} = require("../../controllers/admin/deposit.admin.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");

// GET ALL DEPOSITS
router.get(
    "/deposits",
    authMiddleware,
    adminMiddleware,
    getAllDeposits
);

// APPROVE DEPOSIT
router.post(
    "/deposit/approve/:depositId",
    authMiddleware,
    adminMiddleware,
    approveDeposit
);

// REJECT DEPOSIT
router.post(
    "/deposit/reject/:depositId",
    authMiddleware,
    adminMiddleware,
    rejectDeposit
);

module.exports = router;
