import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import STLViewer from "@/components/STLViewer";

// ✅ Function to format file URLs
const getFileUrl = (filePath) => {
  if (!filePath) return null;
  return `https://auction-app-j7t8.onrender.com/${filePath.replace(/\\/g, "/")}`;
};

export const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await axios.get(`https://auction-app-j7t8.onrender.com/api/auctions/${id}`);
        const auctionData = response.data;
        setAuction(auctionData);

        // ✅ Fetch seller details only if `seller` exists
        if (auctionData.seller && auctionData.seller._id) {
          const sellerResponse = await axios.get(`https://auction-app-j7t8.onrender.com/api/users/${auctionData.seller._id}`);
          setSeller(sellerResponse.data);
        }
      } catch (err) {
        setError("Failed to fetch auction details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id]);


  const handleBid = async () => {
    if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= auction.currentBid) {
      alert("Enter a valid bid higher than the current bid.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be signed in to place a bid.");
        return;
      }

      // ✅ Place the bid
      const response = await axios.post(
        `https://auction-app-j7t8.onrender.com/api/bid/${id}`,
        { bid: parseFloat(bidAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update auction details
      setAuction(response.data.auction);
      setBidAmount("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place bid. Try again.");
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  // ✅ Get formatted image URLs
  const images = [];
  if (auction.imageRequired) images.push(getFileUrl(auction.imageRequired));
  if (auction.imageOptional1) images.push(getFileUrl(auction.imageOptional1));
  if (auction.imageOptional2) images.push(getFileUrl(auction.imageOptional2));
  if (auction.imageOptional3) images.push(getFileUrl(auction.imageOptional3));

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Slider */}
        <div>
          <Swiper
            navigation={true}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            className="w-full h-96 rounded-lg shadow-lg"
          >
            {images.length > 0 ? (
              images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img} alt={`Auction Image ${index + 1}`} className="w-full h-96 object-contain rounded-lg" />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <img src="placeholder.jpg" alt="No Image Available" className="w-full h-96 object-contain rounded-lg" />
              </SwiperSlide>
            )}
          </Swiper>

          {/* 3D Model Viewer */}
          {auction.model3D && (
            <div className="mt-4 w-full h-96 bg-gray-100 flex justify-center items-center rounded-lg overflow-hidden">
              <div className="w-full h-full">
                <STLViewer modelUrl={getFileUrl(auction.model3D)} />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{auction.description}</p>
          </div>
        </div>

        {/* Auction Details & Bidding */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{auction.itemName}</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>Ends on {new Date(auction.closingTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Tag className="w-5 h-5 mr-2" />
                <span>{auction.category || "Uncategorized"}</span>
              </div>
            </div>

            <div className="border-t border-b py-4 my-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Current Bid:</span>
                <span className="text-2xl font-bold text-green-600">${auction.currentBid}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Starting Price:</span>
                <span className="text-gray-600">${auction.startingBid || "N/A"}</span>
              </div>
            </div>

            {!auction.isClosed ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder="Enter your bid"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg mr-2"
                  />
                  <Button onClick={handleBid}>Place Bid</Button>
                </div>
              </div>
            ) : (
              <p className="text-red-500 font-bold">Auction is closed.</p>
            )}
          </div>

          {/* ✅ Seller Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
            {seller ? (
              <div className="flex items-center">
                <User className="w-10 h-10 text-gray-400 mr-4" />
                <div>
                  <p className="font-medium">{seller.fullName}</p>
                  <p className="text-gray-600 text-sm">Email: {seller.email}</p>
                  <p className="text-gray-600 text-sm">Joined: {new Date(seller.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Seller information not available.</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
