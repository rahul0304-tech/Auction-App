const express = require('express');
const multer = require('multer');
const path = require('path');
const AuctionItem = require('../models/auctions');
const User = require('../models/users');
const authenticate = require('../middleware/authenticate');
const mongoose = require("mongoose");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ✅ Updated file filter to correctly handle STL files
const fileFilter = (req, file, cb) => {
  console.log("🔍 Detected file:", file.originalname, "Type:", file.mimetype);

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "model/stl",
    "model/amf",
    "application/sla", // STL files might be recognized as this
    "application/octet-stream", // Some browsers send STL as this
  ];

  if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith(".stl")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and 3D model files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// ✅ Fetch seller info
router.get("/users/:id", async (req, res) => {
  try {
    const sellerId = req.params.id;

    // ✅ Check if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid seller ID format" });
    }

    const user = await User.findById(sellerId).select("fullName email createdAt");
    if (!user) return res.status(404).json({ message: "Seller not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching seller details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Create auction with images and 3D model
router.post("/auction", authenticate, upload.fields([
  { name: "images", maxCount: 5 },
  { name: "model3D", maxCount: 1 }
]), async (req, res) => {
  try {
    console.log("📩 Received Auction Data:", req.body); // Debugging log

    let { itemName, description, startingBid, closingTime, category } = req.body;

    // Check required fields
    if (!itemName || !description || !startingBid || !closingTime || !category) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Parse and validate startingBid
    startingBid = parseFloat(startingBid);
    if (isNaN(startingBid)) {
      return res.status(400).json({ message: "Invalid startingBid value" });
    }

    // Trim category to avoid empty spaces
    category = category.trim();

    // Validate if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Handle file uploads
    const images = req.files["images"] ? req.files["images"].map(file => file.path) : [];
    const model3D = req.files["model3D"] ? req.files["model3D"][0].path : null;

    // Create the auction
    const newAuction = new AuctionItem({
      itemName,
      description,
      startingBid,
      currentBid: startingBid,
      highestBidder: null,
      closingTime,
      category,
      seller: req.user.userId,
      imageRequired: images.length > 0 ? images[0] : null, // First image as required
      imageOptional1: images.length > 1 ? images[1] : null,
      imageOptional2: images.length > 2 ? images[2] : null,
      imageOptional3: images.length > 3 ? images[3] : null,
      model3D: model3D || null
    });

    await newAuction.save();

    // Update the user's postedAuctions array
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { postedAuctions: newAuction._id }
    });

    console.log("✅ Auction successfully posted:", newAuction); // Debugging log

    res.status(201).json({ message: "Auction created successfully", auction: newAuction });

  } catch (error) {
    console.error("❌ Error posting auction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Update auction (only by seller)
router.put('/auction/:id', authenticate, async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized: You are not the owner of this auction' });
    }
    
    Object.assign(auction, req.body);
    await auction.save();
    res.json({ message: 'Auction updated successfully', auction });
  } catch (error) {
    console.error("Updating Auction Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Delete auction (only by seller)
router.delete('/auction/:id', authenticate, async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized: You are not the owner of this auction' });
    }
    
    await auction.deleteOne();
    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    console.error("Deleting Auction Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
