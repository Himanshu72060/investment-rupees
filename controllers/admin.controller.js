const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * =========================
 * ADMIN LOGIN
 * =========================
 * POST /api/admin/login
 */
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: "Admin account is blocked"
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // ✅ Generate JWT
        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // update last login
        admin.lastLogin = new Date();
        await admin.save();

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * =========================
 * ADMIN PROFILE
 * =========================
 * GET /api/admin/profile
 */
exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select("-password");

        res.status(200).json({
            success: true,
            admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
