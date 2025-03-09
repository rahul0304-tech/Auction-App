require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs'); // ✅ Ensure uploads directory exists
const path = require('path');
const connectDB = require('./db/dbconnect');
const authRoutes = require('./routes/authRoutes');
const auctionRoutes = require('./routes/auctionRoutes');

const app = express();

// ✅ Ensure the uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
connectDB();

// ✅ API Routes
app.use('/api', authRoutes);
app.use('/api', auctionRoutes);

// ✅ Serve uploaded files (Images & STL models)
app.use('/uploads', express.static(uploadsDir, { 
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.stl')) {
      res.setHeader('Content-Type', 'model/stl');
      res.setHeader('Content-Disposition', 'inline'); // ✅ Ensure STL files open correctly
    }
  }
}));

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
