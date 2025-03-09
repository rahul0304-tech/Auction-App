import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign } from 'lucide-react';
import { Button } from './ui/Button';

// Helper function to get proper image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return "placeholder.jpg";
  const normalizedPath = imagePath.replace(/\\/g, "/");
  return `https://auction-app-j7t8.onrender.com/${normalizedPath}`;
};

export const AuctionItem = ({ auction }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={auction.imageRequired ? getImageUrl(auction.imageRequired) : "placeholder.jpg"} 
        alt={auction.itemName}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{auction.itemName}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {auction.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {new Date(auction.closingTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center text-green-600 font-semibold">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>${auction.currentBid}</span>
          </div>
        </div>
        <Link to={`/auctions/${auction._id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </div>
    </div>
  );
};
