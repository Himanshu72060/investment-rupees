const mongoose = require("mongoose");


const investmentSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    dailyPercent: Number,
    totalDays: Number,
    daysCompleted: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Investment", investmentSchema);