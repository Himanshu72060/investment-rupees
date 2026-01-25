const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["upi", "bank"],
            required: true
        },

        // 🔹 UPI DETAILS
        upiId: {
            type: String,
            required: function () {
                return this.paymentMethod === "upi";
            }
        },

        // 🔹 BANK DETAILS
        accountHolderName: {
            type: String,
            required: function () {
                return this.paymentMethod === "bank";
            }
        },
        accountNumber: {
            type: String,
            required: function () {
                return this.paymentMethod === "bank";
            }
        },
        ifscCode: {
            type: String,
            required: function () {
                return this.paymentMethod === "bank";
            }
        },
        bankName: {
            type: String,
            required: function () {
                return this.paymentMethod === "bank";
            }
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "paid"],
            default: "pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", withdrawalSchema);
