const Withdrawal = require("../models/Withdrawal");
const User = require("../models/User");


exports.withdraw = async (req, res) => {
    const { amount } = req.body;
    if (amount < 50) return res.json({ message: "Minimum 50" });


    const user = await User.findById(req.user.id);
    if (user.walletBalance < amount)
        return res.json({ message: "Insufficient balance" });


    user.walletBalance -= amount;
    await user.save();


    await Withdrawal.create({ userId: user._id, amount });
    res.json({ success: true });
};