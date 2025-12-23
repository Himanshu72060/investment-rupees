const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res) => {
    const { name, email, phone, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);


    const user = await User.create({
        name,
        email,
        phone,
        password: hashed,
        referralCode: Math.random().toString(36).substring(2, 8)
    });


    res.json({ success: true, user });
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });


    if (!user) return res.status(404).json({ message: "Not found" });


    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });


    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user });
};