import express from "express";
import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";
import bcrypt from "bcryptjs";
import adminProtect from "../middleware/adminProtect.js";
const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route   POST /api/admin/login
// @desc    Login admin
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password.",
      });
    }

    const admin = await AdminUser.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    res.json({
      success: true,
      message: "Admin logged in successfully.",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      token: generateToken(admin._id),
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during admin login.",
    });
  }
});

// TEMPORARY ROUTE: create first admin
// Remove this route after the first admin account is created.
router.post("/create-first-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const adminExists = await AdminUser.findOne({ email });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists.",
      });
    }

    const admin = await AdminUser.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating admin.",
    });
  }
});
/// @route   PUT /api/admin/change-password
// @desc    Change logged-in admin password
// @access  Admin
router.put("/change-password", adminProtect, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all password fields.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const admin = await AdminUser.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change admin password error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error while changing password.",
    });
  }
});
export default router;
