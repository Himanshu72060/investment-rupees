const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const c = require("../controllers/admin.controller");
router.get("/users", auth, admin, c.getUsers);
router.put("/block/:id", auth, admin, c.blockUser);
module.exports = router;