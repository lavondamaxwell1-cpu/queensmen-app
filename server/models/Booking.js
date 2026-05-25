import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    eventType: {
      type: String,
      required: true,
      enum: [
        "Fashion Show",
        "Photoshoot",
        "Brand Campaign",
        "Promotional Event",
        "Private Event",
        "Other",
        "Music Video Shoot",
      ],
    },

    eventDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      type: String,
      default: "",
    },

    eventDuration: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    numberOfModels: {
      type: Number,
      required: true,
      min: 1,
    },
    assignedModels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ModelProfile",
      },
    ],
    budget: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Declined", "Completed", "Canceled"],
      default: "Pending",
    },

    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
