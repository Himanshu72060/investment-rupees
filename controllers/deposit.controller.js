const User = require("../models/User");
const Deposit = require("../models/Deposit");
const Transaction = require("../models/Transaction");

/*
 STATUS FLOW
 pending  → user deposit request
 approved → admin approve → wallet add
 rejected → admin reject
*/

// ==========================
// ✅ USER CREATE DEPOSIT
// ==========================
exports.createDeposit = async (req, res) => {
    try {
        const { amount, utr, referenceId } = req.body;

        if (!amount || amount < 300) {
            return res.status(400).json({
                success: false,
                message: "Minimum deposit amount is ₹300"
            });
        }

        const deposit = await Deposit.create({
            user: req.user.id,
            amount,
            utr,
            referenceId,
            status: "pending"
        });

        res.json({
            success: true,
            message: "Deposit request submitted, waiting for approval",
            deposit
        });

    } catch (error) {
        console.error("Create Deposit Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================
// ✅ USER MY DEPOSITS
// ==========================
exports.getMyDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.find({ user: req.user.id })
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
// ✅ ADMIN GET ALL DEPOSITS
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
// ✅ ADMIN APPROVE DEPOSIT
// ==========================
exports.approveDeposit = async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.id);
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

        // 💰 Add wallet
        user.wallet += deposit.amount;
        await user.save();

        deposit.status = "approved";
        await deposit.save();

        // 🧾 Transaction
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
        console.error("Approve Deposit Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================
// ❌ ADMIN REJECT DEPOSIT
// ==========================
exports.rejectDeposit = async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.id);
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

// ==========================
// ✅ all user deposits (admin)
// ==========================
exports.getAllUserDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.find({ user: req.params.userId })
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
