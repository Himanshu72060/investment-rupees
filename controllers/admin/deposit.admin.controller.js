const Deposit = require("../../models/Deposit");
const User = require("../../models/User");
const Transaction = require("../../models/Transaction");

// ✅ ADMIN → APPROVE DEPOSIT
exports.approveDeposit = async (req, res) => {
    try {
        const { depositId } = req.params;

        const deposit = await Deposit.findById(depositId);
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
        user.wallet += deposit.amount;
        await user.save();

        deposit.status = "approved";
        await deposit.save();

        await Transaction.create({
            user: user._id,
            type: "deposit",
            amount: deposit.amount,
            note: "Admin approved deposit"
        });

        res.json({
            success: true,
            message: "Deposit approved successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
