const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const User = require('./model/user'); 
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Main route to handle mail and user storage
app.post("/send_mail", async (req, res) => {
  const { Name, email, contact, interestedArea } = req.body;
  console.log(req.body);

  if (!Name || !email || !contact || !interestedArea) {
    return res.status(400).json("Please fill all required fields");
  }

  try {
    // Save user info in MongoDB
    const newUser = new User({
      name: Name,
      gmail: email,
      contactNo: contact,
      interestedArea: interestedArea
    });

    await newUser.save();

    // Send email notification
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let message = {
      from: "yash.portfolio.message@gmail.com",
      to: "yashdhokane12@gmail.com",
      subject: `New Message from ${email}`,
      text: `Hi Yash, you have a message from ${Name}.
Email: ${email}
Contact No: ${contact}
Interested Area: ${interestedArea}`,
    };

    await transporter.sendMail(message);

    return res.status(200).json("Message sent and data stored successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json("Server error. Please try again.");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
