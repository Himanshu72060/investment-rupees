const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");

exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone, sponsorCode } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            sponsorCode
        });

        // ✅ TOKEN GENERATE HERE
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "Signup successful",
            token, // 🔥 FRONTEND USE THIS
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// .
/**
 * =========================
 * USER LOGIN
 * =========================
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 2️⃣ Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3️⃣ Compare password (DB me hashed hona chahiye)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 4️⃣ Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 5️⃣ Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token, // 🔥 frontend yahin se token lega
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                wallet: user.wallet,
                role: user.role
            }
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
