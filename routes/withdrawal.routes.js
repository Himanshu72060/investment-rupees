const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const c = require("../controllers/withdrawal.controller");
router.post("/", auth, c.withdraw);
module.exports = router;