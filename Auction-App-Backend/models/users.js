const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },  // New field
  location: { type: String, default: "" },  // New field
  password: { type: String, required: true },
  
  // Auctions Tracking
  postedAuctions: [{ type: mongoose.Schema.Types.ObjectId, ref: "AuctionItem" }],
  participatedAuctions: [{ type: mongoose.Schema.Types.ObjectId, ref: "AuctionItem" }],
  wonAuctions: [{ type: mongoose.Schema.Types.ObjectId, ref: "AuctionItem" }],

  // Recent Activity
  recentActivity: [
    {
      description: String,
      date: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);