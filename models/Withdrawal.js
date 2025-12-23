const mongoose = require("mongoose");


const withdrawalSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    status: { type: String, default: "pending" }
});


module.exports = mongoose.model("Withdrawal", withdrawalSchema);