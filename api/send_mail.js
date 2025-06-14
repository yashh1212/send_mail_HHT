const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const User = require("../model/user");

let conn = null;

async function connectToDatabase() {
  if (conn == null) {
    conn = await mongoose.connect(process.env.MONGO_URI);
  }
}

export default async function handler(req, res) {
  // ✅ Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Or use "http://localhost:3000"
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).send("OK");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { Name, email, contact, interestedArea } = req.body;

  if (!Name || !email || !contact || !interestedArea) {
    return res.status(400).json("Please fill all required fields");
  }

  try {
    await connectToDatabase();

    const newUser = new User({
      name: Name,
      gmail: email,
      contactNo: contact,
      interestedArea: interestedArea,
    });

    await newUser.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const message = {
      from: process.env.SMTP_USER,
      to: "yashdhokane12@gmail.com",
      subject: `New Message from ${email}`,
      text: `Hi Yash, you have a message from ${Name}.\nEmail: ${email}\nContact: ${contact}\nInterested Area: ${interestedArea}`,
    };

    await transporter.sendMail(message);

    return res.status(200).json("Message sent and data stored successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json("Server error. Please try again.");
  }
}
