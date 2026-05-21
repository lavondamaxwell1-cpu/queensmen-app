import express from "express";
import BusinessSettings from "../models/BusinessSettings.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

const getOrCreateSettings = async () => {
  let settings = await BusinessSettings.findOne();

  if (!settings) {
    settings = await BusinessSettings.create({});
  }

  return settings;
};

// @route   GET /api/settings
// @desc    Get public business settings
// @access  Public
router.get("/", async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while getting business settings.",
    });
  }
});

// @route   PUT /api/settings
// @desc    Update business settings
// @access  Admin
router.put("/", adminProtect, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const updatedSettings = await BusinessSettings.findByIdAndUpdate(
      settings._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: "Business settings updated successfully.",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating business settings.",
    });
  }
});

export default router;
