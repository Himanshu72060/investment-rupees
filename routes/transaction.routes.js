const express = require("express");
const router = express.Router();

const {
    getMyTransactions,
    getAllTransactions
} = require("../controllers/transaction.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

// user history
router.get("/my", authMiddleware, getMyTransactions);

// admin all history
router.get("/all", authMiddleware, adminMiddleware, getAllTransactions);

module.exports = router;
