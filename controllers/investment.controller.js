const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

/*
 PLAN LOGIC
*/
function getPlanDetails(amount) {
    if (amount >= 300 && amount <= 10000) {
        return { dailyPercent: 2, days: 100 };
    }
    if (amount > 10000 && amount <= 30000) {
        return { dailyPercent: 3, days: 66 };
    }
    if (amount > 30000) {
        return { dailyPercent: 4, days: 50 };
    }
    return null;
}

// ✅ CREATE INVESTMENT (FROM WALLET)
const createInvestment = async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.user.id);

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

        const plan = getPlanDetails(amount);
        if (!plan) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan"
            });
        }

        // wallet minus
        user.wallet -= amount;
        await user.save();

        const investment = await Investment.create({
            user: user._id,
            amount,
            dailyPercent: plan.dailyPercent,
            totalDays: plan.days,
            endDate: new Date(Date.now() + plan.days * 86400000)
        });

        await Transaction.create({
            user: user._id,
            type: "investment",
            amount,
            note: "Investment started"
        });

        res.json({
            success: true,
            message: "Investment successful",
            investment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ GET MY INVESTMENTS
const getMyInvestments = async (req, res) => {
    try {
        const investments = await Investment.find({ user: req.user.id });

        res.json({
            success: true,
            data: investments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ SUMMARY
const getInvestmentSummary = async (req, res) => {
    try {
        const investments = await Investment.find({ user: req.user.id });

        let totalInvested = 0;
        let totalEarning = 0;

        investments.forEach(inv => {
            totalInvested += inv.amount;
            totalEarning += inv.totalEarned || 0;
        });

        res.json({
            success: true,
            totalInvested,
            totalEarning,
            totalPlans: investments.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ EXPORTS (VERY IMPORTANT — LAST LINE)
module.exports = {
    createInvestment,
    getMyInvestments,
    getInvestmentSummary
};
