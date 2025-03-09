import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import axios from 'axios';

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }
        const response = await axios.get("http://localhost:5001/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-8 flex justify-center">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden text-center">
          <div className="bg-blue-600 h-32"></div>
          <div className="px-6 pb-6 relative">
            <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white flex items-center justify-center mx-auto -mt-16">
              <User className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold mt-4">{user?.fullName}</h1>
            <p className="text-gray-600">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <span>{user?.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <span>{user?.location || "Not provided"}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Auctions Won</p>
                <p className="text-xl font-bold">{user?.wonAuctions.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-600">Active Bids</p>
                <p className="text-xl font-bold">{user?.participatedAuctions.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="divide-y">
            {user?.recentActivity && user.recentActivity.length > 0 ? (
              user.recentActivity.map((activity, index) => (
                <div key={index} className="p-4">
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="p-4 text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};