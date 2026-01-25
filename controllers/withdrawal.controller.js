const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");
const Transaction = require("../models/Transaction");



/* =========================
   CREATE WITHDRAW REQUEST
========================= */
exports.createWithdrawal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount } = req.body;

        if (!amount || amount < 50) {
            return res.status(400).json({
                success: false,
                message: "Minimum withdrawal amount is ₹50"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.wallet < amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance"
            });
        }

        // Deduct wallet balance
        user.wallet -= amount;
        await user.save();

        const withdrawal = await Withdrawal.create({
            user: userId,
            amount,
            status: "pending"
        });

        await Transaction.create({
            user: userId,
            type: "withdraw",
            amount,
            note: "Withdraw requested"
        });


        res.status(201).json({
            success: true,
            message: "Withdrawal request submitted",
            withdrawal
        });
    } catch (error) {
        console.error("Withdrawal Error:", error);
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
        const userId = req.user.id;

        const withdrawals = await Withdrawal.find({ user: userId }).sort({
            createdAt: -1
        });

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
update WITHDRAW STATUS
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
            message: "Withdrawal status updated",
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
   ALL WITHDRAWALS (ADMIN)
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
