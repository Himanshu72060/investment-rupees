const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: ["deposit", "withdraw", "bonus", "refund", "investment"],
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            default: "success"
        },

        note: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
