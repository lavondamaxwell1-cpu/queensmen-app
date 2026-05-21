import express from "express";
import Flyer from "../models/Flyer.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

// @route   GET /api/flyers
// @desc    Get active flyers for public page
// @access  Public
router.get("/", async (req, res) => {
  try {
    const flyers = await Flyer.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: flyers.length,
      flyers,
    });
  } catch (error) {
    console.error("Get flyers error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while getting flyers.",
    });
  }
});

// @route   GET /api/flyers/admin/all
// @desc    Get all flyers for admin
// @access  Admin
router.get("/admin/all", adminProtect, async (req, res) => {
  try {
    const flyers = await Flyer.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: flyers.length,
      flyers,
    });
  } catch (error) {
    console.error("Get admin flyers error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while getting admin flyers.",
    });
  }
});

// @route   POST /api/flyers
// @desc    Create flyer
// @access  Admin
router.post("/", adminProtect, async (req, res) => {
  try {
    const {
      title,
      type,
      date,
      location,
      tourDates,
      description,
      image,
      isActive,
    } = req.body;
    if (!title || !type || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, type, and description are required.",
      });
    }

   const flyer = await Flyer.create({
     title,
     type,
     date: date || undefined,
     location,
     tourDates: tourDates || [],
     description,
     image,
     isActive: isActive !== undefined ? isActive : true,
   });
    res.status(201).json({
      success: true,
      message: "Flyer created successfully.",
      flyer,
    });
  } catch (error) {
    console.error("Create flyer error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating flyer.",
    });
  }
});

// @route   PUT /api/flyers/:id
// @desc    Update flyer
// @access  Admin
router.put("/:id", adminProtect, async (req, res) => {
  try {
    const flyer = await Flyer.findById(req.params.id);

    if (!flyer) {
      return res.status(404).json({
        success: false,
        message: "Flyer not found.",
      });
    }

    const updatedFlyer = await Flyer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.json({
      success: true,
      message: "Flyer updated successfully.",
      flyer: updatedFlyer,
    });
  } catch (error) {
    console.error("Update flyer error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating flyer.",
    });
  }
});

// @route   DELETE /api/flyers/:id
// @desc    Delete flyer
// @access  Admin
router.delete("/:id", adminProtect, async (req, res) => {
  try {
    const flyer = await Flyer.findById(req.params.id);

    if (!flyer) {
      return res.status(404).json({
        success: false,
        message: "Flyer not found.",
      });
    }

    await flyer.deleteOne();

    res.json({
      success: true,
      message: "Flyer deleted successfully.",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Delete flyer error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting flyer.",
    });
  }
});

export default router;
