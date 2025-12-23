const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");


module.exports = async () => {
    const investments = await Investment.find({ isActive: true });


    for (let inv of investments) {
        if (inv.daysCompleted >= inv.totalDays) {
            inv.isActive = false;
            await inv.save();
            continue;
        }


        const roi = (inv.amount * inv.dailyPercent) / 100;
        const gst = roi * 0.18;
        const net = roi - gst;


        const user = await User.findById(inv.userId);
        user.walletBalance += net;
        user.totalEarnings += net;
        await user.save();


        inv.daysCompleted += 1;
        await inv.save();


        await Transaction.create({ userId: user._id, type: "roi", amount: net, gst });
    }
};