import express from "express";
import ModelProfile from "../models/ModelProfile.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

// @route   GET /api/models
// @desc    Get all active models
// @access  Public
router.get("/", async (req, res) => {
  try {
    const models = await ModelProfile.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: models.length,
      models,
    });
  } catch (error) {
    console.error("Get models error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while getting models.",
    });
  }
});

// @route   GET /api/models/admin/all
// @desc    Get all models for admin
// @access  Admin
router.get("/admin/all", adminProtect, async (req, res) => {
  try {
    const models = await ModelProfile.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: models.length,
      models,
    });
  } catch (error) {
    console.error("Get admin models error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while getting admin models.",
    });
  }
});// @route   GET /api/models/featured/list
// @desc    Get featured active models
// @access  Public
router.get("/featured/list", async (req, res) => {
  try {
    const models = await ModelProfile.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      success: true,
      count: models.length,
      models,
    });
  } catch (error) {
    console.error("Get featured models error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while getting featured models.",
    });
  }
});



// @route   GET /api/models/:id
// @desc    Get single model
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const model = await ModelProfile.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model profile not found.",
      });
    }

    res.json({
      success: true,
      model,
    });
  } catch (error) {
    console.error("Get model error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while getting model profile.",
    });
  }
});

// @route   POST /api/models
// @desc    Create model profile
// @access  Admin
router.post("/", adminProtect, async (req, res) => {
  try {
    const {
      name,
      category,
      location,
      height,
      experience,
      availability,
      bio,
      image,
      portfolioImages,
      isFeatured,
      isActive,
    } = req.body;

    if (!name || !category || !location || !bio) {
      return res.status(400).json({
        success: false,
        message: "Name, category, location, and bio are required.",
      });
    }

    const model = await ModelProfile.create({
      name,
      category,
      location,
      height,
      experience,
      availability,
      bio,
      image,
      portfolioImages: portfolioImages || [],
      isFeatured: isFeatured || false,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Model profile created successfully.",
      model,
    });
  } catch (error) {
    console.error("Create model error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating model profile.",
    });
  }
});

// @route   PUT /api/models/:id
// @desc    Update model profile
// @access  Admin
router.put("/:id", adminProtect, async (req, res) => {
  try {
    const model = await ModelProfile.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model profile not found.",
      });
    }

    const updatedModel = await ModelProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.json({
      success: true,
      message: "Model profile updated successfully.",
      model: updatedModel,
    });
  } catch (error) {
    console.error("Update model error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating model profile.",
    });
  }
});

// @route   DELETE /api/models/:id
// @desc    Delete model profile
// @access  Admin
router.delete("/:id", adminProtect, async (req, res) => {
  try {
    const model = await ModelProfile.findById(req.params.id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model profile not found.",
      });
    }

    await model.deleteOne();

    res.json({
      success: true,
      message: "Model profile deleted successfully.",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Delete model error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting model profile.",
    });
  }
});

export default router;
