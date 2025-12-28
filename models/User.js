const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true },
        phone: String,
        password: String,
        sponsorCode: String,
        role: { type: String, default: "user" },
        wallet: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
