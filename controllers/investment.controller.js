const Investment = require("../models/Investment");


exports.createInvestment = async (req, res) => {
    const { amount } = req.body;


    let dailyPercent = 2, totalDays = 100;
    if (amount > 10000 && amount <= 30000) {
        dailyPercent = 3; totalDays = 66;
    } else if (amount > 30000) {
        dailyPercent = 4; totalDays = 50;
    }


    const invest = await Investment.create({
        userId: req.user.id,
        amount,
        dailyPercent,
        totalDays
    });


    res.json(invest);
};