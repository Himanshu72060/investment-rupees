// const mongoose = require("mongoose");

// const investmentSchema = new mongoose.Schema(
//     {
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },

//         amount: {
//             type: Number,
//             required: true
//         },

//         dailyPercent: {
//             type: Number,
//             required: true
//         },

//         totalDays: {
//             type: Number,
//             required: true
//         },

//         daysCompleted: {
//             type: Number,
//             default: 0
//         },

//         totalEarned: {
//             type: Number,
//             default: 0
//         },

//         status: {
//             type: String,
//             default: "active"
//         },

//         startDate: {
//             type: Date,
//             default: Date.now
//         }
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("Investment", investmentSchema);

const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    dailyPercent: Number,
    totalDays: Number,
    earnedDays: { type: Number, default: 0 },
    status: { type: String, default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Investment", investmentSchema);
