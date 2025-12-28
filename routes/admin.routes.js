const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const adminAuth = require("../middleware/admin.middleware");

router.post("/login", adminController.adminLogin);
router.get("/profile", adminAuth, adminController.getAdminProfile);

module.exports = router;
