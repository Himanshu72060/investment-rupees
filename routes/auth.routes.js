const express = require("express");
const router = express.Router();
const { signup, login, getAllUsers } = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", getAllUsers);

module.exports = router;
