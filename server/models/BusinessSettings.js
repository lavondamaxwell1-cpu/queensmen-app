import mongoose from "mongoose";

const businessSettingsSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: "The QueensMen",
      trim: true,
    },

    tagline: {
      type: String,
      default: "Exclusive Professional Male Models",
      trim: true,
    },

    phone: {
      type: String,
      default: "(704) 555-1234",
      trim: true,
    },

    email: {
      type: String,
      default: "info@thequeensmen.com",
      trim: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },

    facebook: {
      type: String,
      default: "",
      trim: true,
    },

    tiktok: {
      type: String,
      default: "",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
      trim: true,
    },

    ownerPhoto: {
      type: String,
      default: "",
      trim: true,
    },

    heroDescription: {
      type: String,
      default:
        "The Queensmen are a set of exclusive professional male models. They represent classy and vintage Gentle Men with a touch of boldness.",
      trim: true,
    },

    ownerTitle: {
      type: String,
      default: "The Vision Behind The QueensMen",
      trim: true,
    },

    ownerBio: {
      type: String,
      default:
        "The QueensMen was created to showcase exclusive professional male models who carry themselves with class, vintage style, confidence, and bold character.",
      trim: true,
    },

    ownerQuote: {
      type: String,
      default: "Classy. Vintage. Bold. That is the standard of The QueensMen.",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const BusinessSettings = mongoose.model(
  "BusinessSettings",
  businessSettingsSchema
);

export default BusinessSettings;
