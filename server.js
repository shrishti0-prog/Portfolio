import dotenv from "dotenv";
dotenv.config();

import express from "express";
import nodemailer from "nodemailer";
import dns from "dns";

// Fix Gmail + Railway network issue
dns.setDefaultResultOrder("ipv4first");

const app = express();

/* =========================
   NO CORS MIDDLEWARE NEEDED
   =========================
   We manually allow all origins below
*/

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Manually handle CORS for ALL requests (safe + simple)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // handle preflight instantly
  }

  next();
});

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
    const { name, email, message } = req.body;

    console.log("BODY RECEIVED:", req.body);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing fields",
      });
    }

    if (!process.env.EMAIL || !process.env.PASS) {
      return res.status(500).json({
        success: false,
        error: "ENV missing",
      });
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

    return res.status(500).json({
      success: false,
      error: err.message, // now you will see real error
    });
  }
});
