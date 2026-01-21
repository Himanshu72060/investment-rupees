const express = require("express");
const router = express.Router();

const {
    approveDeposit,
    getAllDeposits
} = require("../../controllers/admin/deposit.admin.controller");

const adminMiddleware = require("../../middleware/admin.middleware");

// ✅ ADMIN APIs
router.get("/deposit/deposits", adminMiddleware, getAllDeposits);
router.put("/deposit/approve/:id", adminMiddleware, approveDeposit);

module.exports = router;
