import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuctionItem } from '@/components/AuctionItem';
import { Button } from '@/components/ui/Button';
import axios from 'axios';

export const MyAuctions = () => {
  const [activeTab, setActiveTab] = useState('auctions');
  const [postedAuctions, setPostedAuctions] = useState([]);
  const [participatedAuctions, setParticipatedAuctions] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAuctions = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please login to view your auctions');
          setLoading(false);
          return;
        }

        // Setup request config with token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Make all requests independently to handle partial failures
        try {
          const postedRes = await axios.get('https://auction-app-j7t8.onrender.com/api/user/posted-auctions', config);
          setPostedAuctions(postedRes.data?.postedAuctions || []);
        } catch (err) {
          console.error("Error fetching posted auctions:", err);
          if (err.response?.status === 403 || err.response?.status === 401) {
            // Token might be expired or invalid
            setError('Your session has expired. Please login again.');
            localStorage.removeItem('token'); // Remove the invalid token
            setTimeout(() => navigate('/signin'), 3000); // Redirect to login after 3 seconds
            return;
          }
        }

        try {
          const bidsRes = await axios.get('https://auction-app-j7t8.onrender.com/api/user/participated-auctions', config);
          setParticipatedAuctions(bidsRes.data?.participatedAuctions || []);
        } catch (err) {
          console.error("Error fetching participated auctions:", err);
          // We already handle auth errors in the first request
        }

        try {
          const wonRes = await axios.get('https://auction-app-j7t8.onrender.com/api/user/won-auctions', config);
          setWonAuctions(wonRes.data?.wonAuctions || []);
        } catch (err) {
          console.error("Error fetching won auctions:", err);
          // We already handle auth errors in the first request
        }

      } catch (err) {
        console.error("Error in auction fetch process:", err);
        setError('Failed to load your auctions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAuctions();
  }, [navigate]);

  // If there's an authentication error, show a message with a login button
  if (error && error.includes('session has expired')) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-medium mb-2">{error}</p>
          <p>Redirecting to login page...</p>
          <Button 
            className="mt-4 bg-red-600 hover:bg-red-700" 
            onClick={() => navigate('/signin')}
          >
            Login Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Activities</h1>
        <Link to="/post-auction">
          <Button className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Post New Auction
          </Button>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{postedAuctions.length}</p>
            <p className="text-gray-600">Active Auctions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{participatedAuctions.length}</p>
            <p className="text-gray-600">Active Bids</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{wonAuctions.length}</p>
            <p className="text-gray-600">Auctions Won</p>
          </div>
        </div>
      </div>

      {/* Tabs for My Auctions, My Bids, My Winnings */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'auctions' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('auctions')}
        >
          My Auctions
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'bids' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('bids')}
        >
          My Bids
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'winnings' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('winnings')}
        >
          My Winnings
        </button>
      </div>

      {/* Conditional Rendering Based on Active Tab */}
      {loading ? (
        <p className="text-center py-10">Loading...</p>
      ) : error && !error.includes('session has expired') ? (
        <p className="text-center py-10 text-red-500">{error}</p>
      ) : activeTab === 'auctions' ? (
        <>
          <h2 className="text-xl font-semibold mb-6">Auctions I'm Selling</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {postedAuctions.length > 0 ? (
              postedAuctions.map((auction) => <AuctionItem key={auction._id} auction={auction} />)
            ) : (
              <p className="text-gray-500">No posted auctions.</p>
            )}
          </div>
        </>
      ) : activeTab === 'bids' ? (
        <>
          <h2 className="text-xl font-semibold mb-6">Auctions I'm Bidding On</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {participatedAuctions.length > 0 ? (
              participatedAuctions.map((auction) => <AuctionItem key={auction._id} auction={auction} />)
            ) : (
              <p className="text-gray-500">No active bids.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-6">Auctions I Won</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wonAuctions.length > 0 ? (
              wonAuctions.map((auction) => <AuctionItem key={auction._id} auction={auction} />)
            ) : (
              <p className="text-gray-500">No won auctions yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
