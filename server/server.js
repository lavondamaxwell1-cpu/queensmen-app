import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import flyerRoutes from "./routes/flyerRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import sendEmail from "./utils/sendEmail.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";


dotenv.config();
connectDB();

const app = express();

// CORS must be BEFORE routes
const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/settings", settingsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/flyers", flyerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/dashboard", dashboardRoutes);



app.get("/", (req, res) => {
  res.send("The QueensMen API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend connected successfully",
  });
});

const PORT = process.env.PORT || 5000;

app.get("/api/test-email", async (req, res) => {
  try {
    const result = await sendEmail({
      to: process.env.OWNER_EMAIL,
      subject: "Test Email from The QueensMen",
      html: "<h2>Email test worked!</h2><p>This came from your backend.</p>",
    });

    res.json({
      success: true,
      message: "Test email attempted.",
      result,
    });
  } catch (error) {
    console.error("Test email error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
