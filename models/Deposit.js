const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: Number,
    utr: String,
    referenceId: String,
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Deposit", depositSchema);
