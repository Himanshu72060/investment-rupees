const express = require("express");
const cors = require("cors");


const authRoutes = require("./routes/auth.routes");
const investmentRoutes = require("./routes/investment.routes");
const withdrawalRoutes = require("./routes/withdrawal.routes");
const adminRoutes = require("./routes/admin.routes");
const adminDepositRoutes = require("./routes/admin/deposit.admin.routes");
const depositRoutes = require("./routes/deposit.routes");



const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/invest", investmentRoutes);
app.use("/api/withdraw", withdrawalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/transaction", require("./routes/transaction.routes"));
app.use("/api/admin", adminDepositRoutes);
app.use("/api/deposit", depositRoutes);
app.use(
    "/api/admin/deposit",
    require("./routes/admin/deposit.admin.routes")
);





app.get("/", (req, res) => res.send("API Running"));


module.exports = app;