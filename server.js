require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const { analyzeCVvsJob } = require("./index"); // Updated index.js

const app = express();

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.tailwindcss.com",
        ],
      },
    },
  })
);
app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// Multer upload configuration with file size limit
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOCX, DOC, and TXT are allowed."));
    }
  },
});

// In-memory storage for results
let results = {};


// POST /api/analyze

app.post(
  "/api/analyze",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jobDescFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const resume = req.files["resume"]?.[0];
      const job = req.files["jobDescFile"]?.[0];

      if (!resume || !job) {
        return res.status(400).json({
          success: false,
          error: "Please upload both files.",
        });
      }

      // Additional file size check
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (resume.size > maxSize) {
        return res.status(400).json({
          success: false,
          error: "Resume file exceeds 5MB limit.",
        });
      }
      if (job.size > maxSize) {
        return res.status(400).json({
          success: false,
          error: "Job description file exceeds 5MB limit.",
        });
      }

      console.log("📂 Files received:", {
        resume: resume.originalname,
        job: job.originalname,
      });

      // Perform analysis
      const result = await analyzeCVvsJob(
        resume.path,
        job.path,
        resume.mimetype,
        job.mimetype
      );

      // Generate unique ID for this analysis
      const id = Date.now().toString();
      results[id] = result;

      console.log("✅ Analysis saved with ID:", id);

      // Return ID to client
      res.json({ success: true, id });
    } catch (err) {
      console.error("❌ Analysis error:", err);
      
      // Handle multer file size errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          error: "File size exceeds 5MB limit.",
        });
      }
      
      res.status(500).json({
        success: false,
        error: err.message || "Analysis failed",
      });
    }
  }
);

// ===============================
// GET /api/results/:id
// ===============================
app.get("/api/results/:id", (req, res) => {
  const id = req.params.id;

  if (!results[id]) {
    return res.status(404).json({
      success: false,
      error: "Result not found. Analysis may have expired.",
    });
  }

  console.log("📊 Returning results for ID:", id);
  res.json(results[id]);
});

// ===============================
// SERVE FRONTEND
// ===============================

// Update this path to your actual frontend folder
const FRONTEND_PATH = path.join(__dirname, "frontend-layout");

app.use(express.static(FRONTEND_PATH));

app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

app.get("/results", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "results.html"));
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Frontend path: ${FRONTEND_PATH}`);
  console.log(`🔑 OpenAI API: ${process.env.OPENAI_API_KEY ? "✅ Configured" : "❌ Missing"}`);
});