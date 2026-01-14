const express = require("express");
const router = express.Router();

const {
    approveDeposit,
    rejectDeposit,
    getAllDeposits
} = require("../controllers/deposit.controller");

const adminMiddleware = require("../middleware/admin.middleware");

// ADMIN ROUTES
router.get("/all", adminMiddleware, getAllDeposits);
router.put("/approve/:id", adminMiddleware, approveDeposit);
router.put("/reject/:id", adminMiddleware, rejectDeposit);

module.exports = router;
