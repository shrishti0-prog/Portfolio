require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
// Route
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
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
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
console.log("updated");
