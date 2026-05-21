import express from "express";
import adminProtect from "../middleware/adminProtect.js";

import Application from "../models/Application.js";
import Booking from "../models/Booking.js";
import ContactMessage from "../models/ContactMessage.js";
import ModelProfile from "../models/ModelProfile.js";
import Flyer from "../models/Flyer.js";

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get admin dashboard stats
// @access  Admin
router.get("/stats", adminProtect, async (req, res) => {
  try {
    const [
      totalApplications,
      pendingApplications,
      totalBookings,
      pendingBookings,
      totalMessages,
      unreadMessages,
      activeModels,
      activeFlyers,
    ] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: "Pending" }),

      Booking.countDocuments(),
      Booking.countDocuments({ status: "Pending" }),

      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: "Unread" }),

      ModelProfile.countDocuments({ isActive: true }),
      Flyer.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      stats: {
        totalApplications,
        pendingApplications,
        totalBookings,
        pendingBookings,
        totalMessages,
        unreadMessages,
        activeModels,
        activeFlyers,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while getting dashboard stats.",
    });
  }
});

export default router;
