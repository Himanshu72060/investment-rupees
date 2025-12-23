const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    referralCode: String,
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    walletBalance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    role: { type: String, default: "user" },
    status: { type: String, default: "active" },
    joiningDate: { type: Date, default: Date.now }
});


module.exports = mongoose.model("User", userSchema);