import React from 'react';
import { Gauge, Package, History } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Gauge className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Active Bids</h3>
          </div>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Package className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold">Won Auctions</h3>
          </div>
          <p className="text-3xl font-bold">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <History className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold">Total Spent</h3>
          </div>
          <p className="text-3xl font-bold">$2,450</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="bg-white rounded-lg shadow-md">
          {/* Activity items would be mapped here */}
          <div className="p-4 border-b">
            <p className="font-medium">Bid placed on Vintage Camera</p>
            <p className="text-sm text-gray-500">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};