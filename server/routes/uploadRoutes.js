import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import adminProtect from "../middleware/adminProtect.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."));
    }

    cb(null, true);
  },
});

const uploadToCloudinary = (fileBuffer, folder = "queensmen") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(fileBuffer);
  });
};

// @route   POST /api/upload
// @desc    Upload image to Cloudinary
// @access  Admin
router.post("/", adminProtect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded.",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, "queensmen");

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload image error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error while uploading image.",
    });
  }
});

export default router;
