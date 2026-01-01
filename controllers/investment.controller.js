const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");




/*
 PLAN LOGIC
 300 – 10000   → 2% daily → 100 days
 10000–30000  → 3% daily → 66 days
 30000+       → 4% daily → 50 days
*/

const getPlanDetails = (amount) => {
    if (amount >= 300 && amount <= 10000) {
        return { percent: 2, days: 100 };
    } else if (amount > 10000 && amount <= 30000) {
        return { percent: 3, days: 66 };
    } else if (amount > 30000) {
        return { percent: 4, days: 50 };
    } else {
        return null;
    }
};

// ✅ CREATE INVESTMENT
exports.createInvestment = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;

        if (amount < 300) {
            return res.status(400).json({
                success: false,
                message: "Minimum investment is ₹300"
            });
        }

        const plan = getPlanDetails(amount);
        if (!plan) {
            return res.status(400).json({ success: false, message: "Invalid plan" });
        }

        const investment = await Investment.create({
            user: userId,
            amount,
            dailyPercent: plan.percent,
            totalDays: plan.days,
            startDate: new Date()
        });

        await Transaction.create({
            user: userId,
            type: "investment",
            amount,
            note: "Investment created"
        });

        res.status(201).json({
            success: true,
            message: "Investment created successfully",
            data: investment
        });
    } catch (error) {
        console.error("Investment Create Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ GET USER INVESTMENTS
exports.getMyInvestments = async (req, res) => {
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

// ✅ DASHBOARD SUMMARY
exports.getInvestmentSummary = async (req, res) => {
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
