const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", (req, res) => {
    res.json({ message: "This is a profile route" });
});

module.exports = router;
