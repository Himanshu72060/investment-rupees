// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//     {
//         name: String,
//         email: { type: String, unique: true },
//         phone: String,
//         password: String,
//         sponsorCode: String,
//         role: { type: String, default: "user" },
//         wallet: { type: Number, default: 0 }
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,

    referralCode: { type: String, unique: true },
    sponsor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    wallet: { type: Number, default: 0 },
    totalInvestment: { type: Number, default: 0 },
    totalEarning: { type: Number, default: 0 },

    role: { type: String, default: "user" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
