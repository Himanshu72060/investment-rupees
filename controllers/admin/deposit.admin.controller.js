const User = require("../../models/User");
const Deposit = require("../../models/Deposit");
const Transaction = require("../../models/Transaction");

// ==========================
// ✅ ADMIN → GET ALL DEPOSITS
// ==========================
exports.getAllDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.find()
            .populate("user", "name email phone")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            deposits
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================
// ✅ ADMIN → APPROVE DEPOSIT
// ==========================
exports.approveDeposit = async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.depositId);

        if (!deposit) {
            return res.status(404).json({
                success: false,
                message: "Deposit not found"
            });
        }

        if (deposit.status === "approved") {
            return res.status(400).json({
                success: false,
                message: "Deposit already approved"
            });
        }

        const user = await User.findById(deposit.user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.wallet = (user.wallet || 0) + deposit.amount;
        await user.save();

        deposit.status = "approved";
        await deposit.save();

        await Transaction.create({
            user: user._id,
            type: "deposit",
            amount: deposit.amount,
            note: "Deposit approved by admin"
        });

        res.json({
            success: true,
            message: "Deposit approved & wallet updated"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================
// ❌ ADMIN → REJECT DEPOSIT
// ==========================
exports.rejectDeposit = async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.depositId);

        if (!deposit) {
            return res.status(404).json({
                success: false,
                message: "Deposit not found"
            });
        }

        deposit.status = "rejected";
        await deposit.save();

        res.json({
            success: true,
            message: "Deposit rejected"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
