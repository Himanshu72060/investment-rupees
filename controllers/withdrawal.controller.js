const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

/* =========================
   CREATE WITHDRAW REQUEST (USER)
========================= */
exports.createWithdrawal = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            amount,
            paymentMethod,
            upiId,
            accountHolderName,
            accountNumber,
            ifscCode,
            bankName
        } = req.body;

        if (!amount || amount < 50) {
            return res.status(400).json({
                success: false,
                message: "Minimum withdrawal amount is ₹50"
            });
        }

        if (!paymentMethod || !["upi", "bank"].includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }

        // 🔥 VALIDATION
        if (paymentMethod === "upi" && !upiId) {
            return res.status(400).json({
                success: false,
                message: "UPI ID required"
            });
        }

        if (paymentMethod === "bank") {
            if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
                return res.status(400).json({
                    success: false,
                    message: "All bank details are required"
                });
            }
        }

        const user = await User.findById(userId);

        if (!user || user.wallet < amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance"
            });
        }

        // 💰 wallet minus
        user.wallet -= amount;
        await user.save();

        const withdrawal = await Withdrawal.create({
            user: userId,
            amount,
            paymentMethod,
            upiId,
            accountHolderName,
            accountNumber,
            ifscCode,
            bankName,
            status: "pending"
        });

        await Transaction.create({
            user: userId,
            type: "withdraw",
            amount,
            note: `Withdraw via ${paymentMethod}`
        });

        res.status(201).json({
            success: true,
            message: "Withdrawal request submitted",
            withdrawal
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/* =========================
   USER WITHDRAW HISTORY
========================= */
exports.getMyWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: withdrawals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* =========================
   ADMIN → UPDATE WITHDRAW STATUS
========================= */
exports.updateWithdrawalStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pending", "approved", "rejected", "withdraw"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
            return res.status(404).json({
                success: false,
                message: "Withdrawal request not found"
            });
        }

        withdrawal.status = status;
        await withdrawal.save();

        res.json({
            success: true,
            message: "Withdrawal status updated successfully",
            withdrawal
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* =========================
   ADMIN → GET ALL WITHDRAWALS
========================= */
exports.getAllWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: withdrawals
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
