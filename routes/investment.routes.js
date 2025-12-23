const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const c = require("../controllers/investment.controller");
router.post("/", auth, c.createInvestment);
module.exports = router;