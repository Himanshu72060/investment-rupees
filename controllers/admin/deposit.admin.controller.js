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

// ==========================
// ✅ ADMIN → UPDATE DEPOSIT STATUS (PENDING → APPROVED)
// ==========================
exports.updateDepositStatus = async (req, res) => {
    try {
        const { depositId } = req.params;
        const { status, notes } = req.body; // status: "approved" or "rejected"

        if (!depositId) {
            return res.status(400).json({
                success: false,
                message: "Deposit ID is required"
            });
        }

        // Validate status
        const validStatuses = ["approved", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'approved' or 'rejected'"
            });
        }

        const deposit = await Deposit.findById(depositId).populate("user", "name email phone wallet");

        if (!deposit) {
            return res.status(404).json({
                success: false,
                message: "Deposit not found"
            });
        }

        if (deposit.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Deposit is already ${deposit.status}. Cannot update.`
            });
        }

        // Check if user exists
        if (!deposit.user) {
            return res.status(404).json({
                success: false,
                message: "User reference not found in deposit"
            });
        }

        // Update deposit status
        deposit.status = status;
        await deposit.save();

        let message = "";
        let userId = deposit.user._id || deposit.user;
        let userName = deposit.user.name || "Unknown";
        let userEmail = deposit.user.email || "N/A";

        let responseData = {
            success: true,
            deposit: {
                _id: deposit._id,
                user: deposit.user,
                amount: deposit.amount,
                status: deposit.status,
                updatedAt: deposit.updatedAt
            }
        };

        // If approved, add funds to user's wallet
        if (status === "approved") {
            const user = await User.findById(userId);

            if (user) {
                user.wallet = (user.wallet || 0) + deposit.amount;
                await user.save();

                // Create transaction record
                await Transaction.create({
                    user: user._id,
                    type: "deposit",
                    amount: deposit.amount,
                    note: notes || "Deposit approved by admin"
                });

                message = "Deposit approved & wallet updated";
            } else {
                message = "Deposit status updated but user not found for wallet credit";
            }
        } else {
            message = "Deposit rejected";
        }

        // Create admin notification
        const adminNotification = {
            type: "deposit_status_update",
            depositId: deposit._id,
            userId: userId,
            userName: userName,
            userEmail: userEmail,
            amount: deposit.amount,
            status: status,
            timestamp: new Date(),
            read: false,
            notes: notes || ""
        };

        responseData.notification = adminNotification;
        responseData.message = message;

        res.json(responseData);

    } catch (error) {
        console.error("Update Deposit Status Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
