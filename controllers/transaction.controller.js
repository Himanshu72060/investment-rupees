const Transaction = require("../models/Transaction");

/* =========================
   USER TRANSACTION HISTORY
========================= */
exports.getMyTransactions = async (req, res) => {
    try {
        const userId = req.user.id;

        const transactions = await Transaction.find({ user: userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            total: transactions.length,
            data: transactions
        });
    } catch (error) {
        console.error("Transaction History Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* =========================
   ADMIN: ALL TRANSACTIONS
========================= */
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate("user", "name email phone")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            total: transactions.length,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
