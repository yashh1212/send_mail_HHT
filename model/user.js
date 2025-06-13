const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  gmail: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"]
  },
  contactNo: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Invalid contact number"]
  },
  interestedArea: {
    type: [String],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("user_informetion", userInfoSchema);
