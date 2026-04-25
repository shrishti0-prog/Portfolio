import dotenv from "dotenv";
dotenv.config();

import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const app = express();

/* =========================
   CORS (CRITICAL FIX)
========================= */
app.use(cors({
  origin: "https://shrishti0-prog.github.io",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// IMPORTANT: handle ALL preflight requests
app.options("*", cors());

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* =========================
   SEND EMAIL ROUTE
========================= */
app.post("/send", async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const transporter = nodemailer.createTransport({
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

    return res.json({ success: true });

  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return res.status(500).json({ success: false });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running 🚀");
});
