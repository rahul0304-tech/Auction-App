require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const AuctionItem = require('../models/auctions'); // Added AuctionItem model
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;


const invalidatedTokens = new Set(); // Store invalidated tokens

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, phone, location } = req.body;
    
    const newUser = new User({
      fullName, email, password, phone, location,
      recentActivity: [{ description: "Joined the platform", date: new Date() }]
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Received Signin Request:", { email, password }); // ✅ Log input

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    console.log("👤 Found User in DB:", user); // ✅ Log user data

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Directly compare the plain-text passwords (for college project purposes)
    if (password !== user.password) {
      console.log("❌ Passwords do not match");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ Passwords match");
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Signin successful", token });

  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/profile", authenticate, async (req, res) => {
  try {
    console.log("🔍 Fetching profile for user:", req.user);
    const user = await User.findById(req.user.userId)
      .populate("postedAuctions", "itemName currentBid")
      .populate("participatedAuctions", "itemName currentBid")
      .populate("wonAuctions", "itemName currentBid");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Profile Fetch Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Logout Route
router.post("/logout", authenticate, async (req, res) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Middleware to prevent blacklisted tokens (Optional)
const checkBlacklist = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (invalidatedTokens.has(token)) {
    return res.status(401).json({ message: "Invalid token. Please log in again." });
  }
  next();
};

// Apply blacklist check to protected routes
router.use(checkBlacklist);


router.get("/user/posted-auctions", authenticate, async (req, res) => {
  try {
    console.log("🔍 Fetching posted auctions for user:", req.user.userId);
    
    const user = await User.findById(req.user.userId).populate("postedAuctions");
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    console.log("📌 Posted Auctions Found:", user.postedAuctions);
    
    res.json({ postedAuctions: user.postedAuctions || [] });
  } catch (error) {
    console.error("⚠️ Error fetching posted auctions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/user/participated-auctions", authenticate, async (req, res) => {
  try {
    console.log("🔍 Fetching participated auctions for user:", req.user.userId);
    
    const user = await User.findById(req.user.userId).populate("participatedAuctions");
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    console.log("📌 Participated Auctions Found:", user.participatedAuctions);
    
    res.json({ participatedAuctions: user.participatedAuctions || [] });
  } catch (error) {
    console.error("⚠️ Error fetching participated auctions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/user/won-auctions", authenticate, async (req, res) => {
  try {
    console.log("🔍 Fetching won auctions for user:", req.user.userId);
    
    const user = await User.findById(req.user.userId).populate("wonAuctions");
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    console.log("📌 Won Auctions Found:", user.wonAuctions);
    
    res.json({ wonAuctions: user.wonAuctions || [] });
  } catch (error) {
    console.error("⚠️ Error fetching won auctions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch all the auctions
router.get('/auctions', async (req, res) => {
  try {
    const auctions = await AuctionItem.find(); // ✅ Fetch all auctions
    res.json(auctions);
  } catch (error) {
    console.error("Fetching Auctions Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch auction by ID
router.get("/auctions/:id", async (req, res) => {
  try {
    const auction = await AuctionItem.findById(req.params.id)
      .populate("seller", "_id fullName email createdAt"); // ✅ Ensuring _id is included
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    res.json(auction);
  } catch (error) {
    console.error("Fetching Auction by ID Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ✅ Corrected Backend Bid Route
router.post("/bid/:auctionId", authenticate, async (req, res) => {
  try {
    const { bid } = req.body;
    const userId = req.user.userId;
    const auctionId = req.params.auctionId;

    const auction = await AuctionItem.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (bid <= auction.currentBid) {
      return res.status(400).json({ message: "Bid must be higher than current bid" });
    }

    // ✅ Update auction
    auction.currentBid = bid;
    auction.highestBidder = userId;
    await auction.save();

    // ✅ Update user's participation & activity
    await User.findByIdAndUpdate(userId, {
      $addToSet: { participatedAuctions: auctionId },
      $push: { recentActivity: { description: `Placed a bid on ${auction.itemName}`, date: new Date() } },
    });

    res.json({ message: "Bid placed successfully", auction });
  } catch (error) {
    console.error("Bid Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

module.exports = router;