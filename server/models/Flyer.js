import mongoose from "mongoose";

const flyerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    // For simple one-date flyers
    date: {
      type: Date,
    },

    location: {
      type: String,
      trim: true,
    },

    // For tour / multiple-city flyers
    tourDates: [
      {
        city: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
        },
        venue: {
          type: String,
          trim: true,
        },
      },
    ],

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
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

const Flyer = mongoose.model("Flyer", flyerSchema);

export default Flyer;
