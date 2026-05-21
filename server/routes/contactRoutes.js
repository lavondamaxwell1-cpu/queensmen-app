import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import adminProtect from "../middleware/adminProtect.js";
import sendEmail from "../utils/sendEmail.js";
const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact message
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required contact fields.",
      });
    }

    const contactMessage = await ContactMessage.create({
      fullName,
      email,
      phone,
      subject,
      message,
    });
try {
  await sendEmail({
    to: process.env.OWNER_EMAIL,
    subject: "New QueensMen Contact Message",
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${contactMessage.fullName}</p>
      <p><strong>Email:</strong> ${contactMessage.email}</p>
      <p><strong>Phone:</strong> ${contactMessage.phone || "N/A"}</p>
      <p><strong>Subject:</strong> ${contactMessage.subject || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${contactMessage.message}</p>
    `,
  });
  
} catch (emailError) {
  console.error("Contact email failed:", emailError);
}
try {
  await sendEmail({
    to: contactMessage.email,
    subject: "We received your message - The QueensMen",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank you for contacting The QueensMen</h2>

        <p>Hi ${contactMessage.fullName},</p>

        <p>
          We received your message and our team will review it soon.
          Someone will follow up with you as soon as possible.
        </p>

        <p><strong>Your message:</strong></p>
        <p>${contactMessage.message}</p>

        <p style="margin-top: 24px;">
          Thank you,<br />
          <strong>The QueensMen Team</strong>
        </p>
      </div>
    `,
  });
} catch (emailError) {
  console.error("Contact confirmation email failed:", emailError);
}
    res.status(201).json({
      success: true,
      message: "Contact message submitted successfully.",
      contactMessage,
    });
  } catch (error) {
    console.error("Submit contact message error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while submitting contact message.",
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages
// @access  Admin later
router.get("/", adminProtect, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get contact messages error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while getting contact messages.",
    });
  }
});

// @route   PATCH /api/contact/:id/status
// @desc    Update contact message status
// @access  Admin
router.patch("/:id/status", adminProtect, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Unread", "Read", "Archived"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact message status.",
      });
    }

    const contactMessage = await ContactMessage.findById(req.params.id);

    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    contactMessage.status = status;

    const updatedMessage = await contactMessage.save();

    res.json({
      success: true,
      message: "Contact message status updated successfully.",
      message: updatedMessage,
    });
  } catch (error) {
    console.error("Update contact message status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating contact message status.",
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact message
// @access  Admin
router.delete("/:id", adminProtect, async (req, res) => {
  try {
    const contactMessage = await ContactMessage.findById(req.params.id);

    if (!contactMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    await contactMessage.deleteOne();

    res.json({
      success: true,
      message: "Contact message deleted successfully.",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Delete contact message error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting contact message.",
    });
  }
});

export default router;
