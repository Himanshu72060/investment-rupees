const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const dailyROI = async () => {
    try {
        const investments = await Investment.find({ status: "active" });

        for (let inv of investments) {
            // plan complete?
            if (inv.daysCompleted >= inv.totalDays) {
                inv.status = "completed";
                await inv.save();
                continue;
            }

            // daily profit
            const dailyProfit = (inv.amount * inv.dailyPercent) / 100;

            // 🔹 credit wallet
            const user = await User.findById(inv.user);
            user.wallet += dailyProfit;
            await user.save();

            // 🔹 update investment
            inv.daysCompleted += 1;
            inv.totalEarned += dailyProfit;
            await inv.save();

            // 🔥 YAHI LAGANA HAI (TRANSACTION LOG)
            await Transaction.create({
                user: inv.user,
                type: "roi",
                amount: dailyProfit,
                note: "Daily ROI credited"
            });
        }

        console.log("✅ Daily ROI completed");
    } catch (error) {
        console.error("❌ Daily ROI Error:", error);
    }
};

module.exports = dailyROI;
