import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Clock, Trophy, Star, Users, Search, TrendingUp, Award, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import axios from "axios";

export const Landing = () => {
  const [featuredAuctions, setFeaturedAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/auctions");
        const auctions = response.data;

        // Sort by highest bid and select the top 3
        const topAuctions = auctions
          .sort((a, b) => b.currentBid - a.currentBid)
          .slice(0, 3);

        setFeaturedAuctions(topAuctions);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Discover Unique Items at Amazing Prices
            </h1>
            <p className="text-xl mb-8">
              Join thousands of collectors and enthusiasts in the most trusted online auction platform.
            </p>
            <Link to="/auctions">
              <Button size="lg" className="flex items-center">
                Browse Auctions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Auctions */}
      <div className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Featured Auctions</h2>
          <Link to="/auctions" className="text-blue-600 hover:text-blue-700 flex items-center">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAuctions.map((auction) => (
            <div key={auction._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={auction.imageRequired ? `http://localhost:5001/${auction.imageRequired}` : "placeholder.jpg"}
                alt={auction.itemName}
                className="w-full h-48 object-contain"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{auction.itemName}</h3>
                <p className="text-green-600 font-bold">${auction.currentBid}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* Why Choose Us */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Secure Bidding</h3>
              <p className="text-gray-600">
                Advanced security measures to protect your transactions
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Clock className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Never miss a bid with instant notifications
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">Expert Verification</h3>
              <p className="text-gray-600">
                All items are verified by our team of experts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users className="w-10 h-10 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Active Users</div>
            </div>
            <div className="text-center">
              <Package className="w-10 h-10 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-blue-200">Auctions Completed</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">$10M+</div>
              <div className="text-blue-200">In Transactions</div>
            </div>
            <div className="text-center">
              <Star className="w-10 h-10 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-200">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Create Account</h3>
              <p className="text-gray-600">Sign up and verify your identity</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Find Items</h3>
              <p className="text-gray-600">Browse through unique auctions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Place Bids</h3>
              <p className="text-gray-600">Bid on items you're interested in</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Win & Collect</h3>
              <p className="text-gray-600">Win auctions and receive items</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="text-xl text-gray-400 mb-8">Join our community of collectors and enthusiasts today.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg" className="flex items-center">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/auctions">
              <Button size="lg" variant="outline" className="flex items-center">
                Browse Auctions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};