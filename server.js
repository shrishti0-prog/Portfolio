require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Contact route
app.post("/send", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body); 

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      console.log("❌ VALIDATION FAILED"); 
      return res.status(400).json({ success: false });
    }

    if (!process.env.EMAIL || !process.env.PASS) {
      console.log("ENV ERROR: Missing EMAIL or PASS");
      return res.status(500).json({ success: false });
    }

    let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      replyTo: email,
      subject: `Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.json({ success: true });

  } catch (err) {
    console.log("EMAIL ERROR:", err);
    res.status(500).json({ success: false });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
