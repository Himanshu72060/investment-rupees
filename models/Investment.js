const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    amount: Number,
    dailyPercent: Number,
    totalDays: Number,

    startDate: { type: Date, default: Date.now },
    endDate: Date,

    totalEarned: { type: Number, default: 0 },

    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active"
    }

}, { timestamps: true });

module.exports = mongoose.model("Investment", investmentSchema);
