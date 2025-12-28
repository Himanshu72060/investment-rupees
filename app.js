const express = require("express");
const cors = require("cors");


const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const investmentRoutes = require("./routes/investment.routes");
const withdrawalRoutes = require("./routes/withdrawal.routes");
const adminRoutes = require("./routes/admin.routes");


const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/invest", investmentRoutes);
app.use("/api/withdraw", withdrawalRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => res.send("API Running"));


module.exports = app;