const User = require("../models/User");


exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};


exports.blockUser = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { status: "blocked" });
    res.json({ success: true });
};