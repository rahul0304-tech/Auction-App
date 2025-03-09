const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  startingBid: { type: Number, required: true }, // ✅ Fix: Ensure Starting Bid is required
  currentBid: { type: Number, required: true }, // ✅ Starts as startingBid
  highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  closingTime: { type: Date, required: true },
  category: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // ✅ Ensure images align with route's structure
  imageRequired: { type: String, default: null }, // First image (main image)
  imageOptional1: { type: String, default: null },
  imageOptional2: { type: String, default: null },
  imageOptional3: { type: String, default: null },

  model3D: { type: String, default: null }, // Path to the 3D model file
  isClosed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("AuctionItem", auctionSchema);
