import express from "express";
import Booking from "../models/Booking.js";
import adminProtect from "../middleware/adminProtect.js";
import sendEmail from "../utils/sendEmail.js";

const getDurationHours = (duration) => {
  if (!duration) return 1;

  if (duration === "1 Hour") return 1;
  if (duration === "2 Hours") return 2;
  if (duration === "3 Hours") return 3;
  if (duration === "4 Hours") return 4;
  if (duration === "Half Day") return 4;
  if (duration === "Full Day") return 8;

  return 1;
};

const buildBookingDateTime = (eventDate, eventTime) => {
  const date = new Date(eventDate);

  if (!eventTime) {
    date.setHours(9, 0, 0, 0);
    return date;
  }

  const [hours, minutes] = eventTime.split(":");

  date.setHours(Number(hours || 9), Number(minutes || 0), 0, 0);

  return date;
};

const bookingsOverlap = (firstStart, firstEnd, secondStart, secondEnd) => {
  return firstStart < secondEnd && secondStart < firstEnd;
};


const router = express.Router();


// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Admin
router.get("/", adminProtect, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("assignedModels")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Fetch bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while loading bookings.",
    });
  }
});



// @route   POST /api/booking
// @desc    Submit booking request
// @access  Public
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      company,
      email,
      phone,
      eventType,
      eventDate,
      location,
      numberOfModels,
      budget,
      message,
      eventTime,
      eventDuration,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !eventType ||
      !eventDate ||
      !location ||
      !numberOfModels
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required booking fields.",
      });
    }

    const booking = await Booking.create({
      fullName,
      company,
      email,
      phone,
      eventType,
      eventDate,
      location,
      numberOfModels,
      budget,
      message,
      eventTime,
      eventDuration,
      eventTime,
      eventDuration,
    });

    try {
      await sendEmail({
        to: process.env.OWNER_EMAIL,
        subject: "New QueensMen Booking Request",
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${booking.fullName}</p>
          <p><strong>Company:</strong> ${booking.company || "N/A"}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          <p><strong>Event Type:</strong> ${booking.eventType}</p>
          <p><strong>Event Date:</strong> ${
            booking.eventDate
              ? new Date(booking.eventDate).toLocaleDateString()
              : "N/A"
          }</p>
          <p><strong>Location:</strong> ${booking.location}</p>
          <p><strong>Models Needed:</strong> ${booking.numberOfModels}</p>
          <p><strong>Budget:</strong> ${booking.budget || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${booking.message || "No message provided."}</p>
        `,
      });
    } catch (emailError) {
      console.error("Booking email failed:", emailError);
    }
try {
  await sendEmail({
    to: booking.email,
    subject: "We received your booking request - The QueensMen",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank you for your booking request</h2>

        <p>Hi ${booking.fullName},</p>

        <p>
          We received your booking request for The QueensMen.
          Our team will review the details and follow up with you soon.
        </p>

        <h3>Booking Details</h3>
        <p><strong>Event Type:</strong> ${booking.eventType}</p>
        <p><strong>Event Date:</strong> ${
          booking.eventDate
            ? new Date(booking.eventDate).toLocaleDateString()
            : "N/A"
        }</p>
        <p><strong>Location:</strong> ${booking.location}</p>
        <p><strong>Models Needed:</strong> ${booking.numberOfModels}</p>
        <p><strong>Budget:</strong> ${booking.budget || "N/A"}</p>

        <p style="margin-top: 24px;">
          Thank you,<br />
          <strong>The QueensMen Team</strong>
        </p>
      </div>
    `,
  });
} catch (emailError) {
  console.error("Booking confirmation email failed:", emailError);
}
    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully.",
      booking,
    });
  } catch (error) {
    console.error("Submit booking error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while submitting booking request.",
    });
  }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status, check conflicts, and email client
// @access  Admin
router.patch("/:id/status", adminProtect, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const allowedStatuses = [
      "Pending",
      "Reviewed",
      "Approved",
      "Declined",
      "Completed",
      "Canceled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking request not found.",
      });
    }

    const previousStatus = booking.status;
    const nextStatus = status || booking.status;

    if (nextStatus === "Approved") {
      if (!booking.eventDate || !booking.eventTime) {
        return res.status(400).json({
          success: false,
          message:
            "This booking needs an event date and event time before it can be approved.",
        });
      }

      const currentStart = buildBookingDateTime(
        booking.eventDate,
        booking.eventTime,
      );

      const currentEnd = new Date(currentStart);
      currentEnd.setHours(
        currentEnd.getHours() + getDurationHours(booking.eventDuration),
      );

      const approvedBookings = await Booking.find({
        _id: { $ne: booking._id },
        status: "Approved",
        eventDate: booking.eventDate,
      });

      const conflict = approvedBookings.find((approvedBooking) => {
        const approvedStart = buildBookingDateTime(
          approvedBooking.eventDate,
          approvedBooking.eventTime,
        );

        const approvedEnd = new Date(approvedStart);
        approvedEnd.setHours(
          approvedEnd.getHours() +
            getDurationHours(approvedBooking.eventDuration),
        );

        return bookingsOverlap(
          currentStart,
          currentEnd,
          approvedStart,
          approvedEnd,
        );
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `Scheduling conflict: ${conflict.fullName} already has an approved booking during this time.`,
        });
      }
    }

    booking.status = nextStatus;

    if (adminNotes !== undefined) {
      booking.adminNotes = adminNotes;
    }

    const updatedBooking = await booking.save();

    if (
      previousStatus !== nextStatus &&
      ["Approved", "Declined", "Completed", "Canceled"].includes(nextStatus)
    ) {
      try {
        await sendEmail({
          to: updatedBooking.email,
          subject: `Your QueensMen booking status: ${updatedBooking.status}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Booking Status Updated</h2>
              <p>Hi ${updatedBooking.fullName},</p>
              <p>Your booking status is now <strong>${updatedBooking.status}</strong>.</p>
              <p><strong>Event Type:</strong> ${updatedBooking.eventType || "N/A"}</p>
              <p><strong>Event Date:</strong> ${
                updatedBooking.eventDate
                  ? new Date(updatedBooking.eventDate).toLocaleDateString()
                  : "N/A"
              }</p>
              <p><strong>Event Time:</strong> ${updatedBooking.eventTime || "N/A"}</p>
              <p><strong>Duration:</strong> ${updatedBooking.eventDuration || "N/A"}</p>
              <p><strong>Location:</strong> ${updatedBooking.location || "N/A"}</p>
              ${
                updatedBooking.adminNotes
                  ? `<p><strong>Notes:</strong> ${updatedBooking.adminNotes}</p>`
                  : ""
              }
              <p style="margin-top: 24px;">
                Thank you,<br />
                <strong>The QueensMen Team</strong>
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Booking status email failed:", emailError);
      }
    }

    res.json({
      success: true,
      message: "Booking status updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating booking status.",
    });
  }
});


// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Admin
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error("Delete booking error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting booking.",
    });
  }
});
// @route   PATCH /api/bookings/:id/assign-models
// @desc    Assign models to booking
// @access  Admin
router.patch("/:id/assign-models", adminProtect, async (req, res) => {
  try {
    const { modelIds } = req.body;

    if (!Array.isArray(modelIds)) {
      return res.status(400).json({
        success: false,
        message: "modelIds must be an array.",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }
const currentStart = buildBookingDateTime(booking.eventDate, booking.eventTime);

const currentEnd = new Date(currentStart);

currentEnd.setHours(
  currentEnd.getHours() + getDurationHours(booking.eventDuration),
);

const conflictingBookings = await Booking.find({
  _id: { $ne: booking._id },
  status: "Approved",
  eventDate: booking.eventDate,
}).populate("assignedModels");

for (const existingBooking of conflictingBookings) {
  const existingStart = buildBookingDateTime(
    existingBooking.eventDate,
    existingBooking.eventTime,
  );

  const existingEnd = new Date(existingStart);

  existingEnd.setHours(
    existingEnd.getHours() + getDurationHours(existingBooking.eventDuration),
  );

  const overlaps = bookingsOverlap(
    currentStart,
    currentEnd,
    existingStart,
    existingEnd,
  );

  if (!overlaps) continue;

  const conflictingModels = existingBooking.assignedModels.filter((model) =>
    modelIds.includes(model._id.toString()),
  );

  if (conflictingModels.length > 0) {
    return res.status(409).json({
      success: false,
      message: `Scheduling conflict: ${
        conflictingModels[0].name || conflictingModels[0].fullName || "Model"
      } is already assigned to another booking during this time.`,
    });
  }
}
    booking.assignedModels = modelIds;

    await booking.save();

    const updatedBooking = await Booking.findById(req.params.id).populate(
      "assignedModels",
    );

    res.json({
      success: true,
      message: "Models assigned successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Assign models error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while assigning models.",
    });
  }
});
export default router;
