import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Auctions } from './pages/Auctions';
import { AuctionDetails } from './pages/AuctionDetails';
import { Profile } from './pages/Profile';
import { MyAuctions } from './pages/MyAuctions';
import { NotFound } from './pages/NotFound';
import { Signin } from './components/Signin';
import { Signup } from './components/Signup';
import { PostAuction } from './components/PostAuction';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/auctions/:id" element={<AuctionDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-auctions" element={<MyAuctions />} />
          <Route path="/post-auction" element={<PostAuction />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;