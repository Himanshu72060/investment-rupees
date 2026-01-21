const express = require("express");
const router = express.Router();

// CONTROLLERS
const {
    createDeposit,
    getMyDeposits,
    getAllDeposits,
    approveDeposit,
    rejectDeposit,
    getAllUserDeposits
} = require("../controllers/deposit.controller");

// MIDDLEWARE
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

/*
  USER ROUTES
  POST   /api/deposit/create   → create deposit request
  GET    /api/deposit/my       → get my deposits
*/
router.post("/create", authMiddleware, createDeposit);
router.get("/my", authMiddleware, getMyDeposits);

/*
  ADMIN ROUTES
  GET    /api/deposit/all           → all deposits (pending/approved/rejected)
  PUT    /api/deposit/approve/:id  → approve deposit by admin
  PUT    /api/deposit/reject/:id   → reject deposit by admin
*/
router.get("/all", adminMiddleware, getAllDeposits);
router.put("/approve/:id", adminMiddleware, approveDeposit);
router.put("/reject/:id", adminMiddleware, rejectDeposit);
router.get("/user/:userId", adminMiddleware, getAllUserDeposits);

module.exports = router;
