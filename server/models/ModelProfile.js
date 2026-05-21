import mongoose from "mongoose";

const modelProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    height: {
      type: String,
      trim: true,
    },

    experience: {
      type: String,
      trim: true,
    },

    availability: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    portfolioImages: [
      {
        type: String,
        trim: true,
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const ModelProfile = mongoose.model("ModelProfile", modelProfileSchema);

export default ModelProfile;
