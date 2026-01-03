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

// ✅ CREATE DEPOSIT WITH REFERRAL COMMISSIONS
exports.createDeposit = async (req, res) => {
    try {
        const userId = req.user.id;
        const { amount } = req.body;

        if (!amount || amount < 300) {
            return res.status(400).json({
                success: false,
                message: "Minimum deposit ₹300"
            });
        }

        const plan = getPlan(amount);
        if (!plan) {
            return res.status(400).json({
                success: false,
                message: "Invalid investment plan"
            });
        }

        const user = await User.findById(userId).populate("sponsor");

        // CREATE INVESTMENT
        const investment = await Investment.create({
            user: userId,
            amount,
            dailyPercent: plan.dailyPercent,
            totalDays: plan.days
        });

        user.totalInvestment += amount;
        await user.save();

        // TRANSACTION LOG
        await Transaction.create({
            user: userId,
            type: "investment",
            amount,
            note: "Investment created"
        });

        // 🔥 REFERRAL COMMISSION
        const referralPercents = [7, 5, 2, 1];
        let currentSponsor = user.sponsor;

        for (let level = 0; level < referralPercents.length; level++) {
            if (!currentSponsor) break;

            const commission = (amount * referralPercents[level]) / 100;
            currentSponsor.wallet += commission;
            currentSponsor.totalEarning += commission;
            await currentSponsor.save();

            await Transaction.create({
                user: currentSponsor._id,
                type: "referral",
                amount: commission,
                note: `Level ${level + 1} referral income`
            });

            currentSponsor = await User.findById(currentSponsor.sponsor);
        }

        res.status(201).json({
            success: true,
            message: "Deposit successful",
            investment,
            referral: {
                yourReferralCode: user.referralCode,
                referralLink: `${process.env.FRONTEND_URL}/signup?ref=${user.referralCode}`
            }
        });

    } catch (error) {
        console.error("Deposit Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
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


