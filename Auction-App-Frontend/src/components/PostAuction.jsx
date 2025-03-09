import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "./ui/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const PostAuction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingPrice: "",
    endDate: "",
    category: "",
    images: [],
    model3D: null,
  });
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    } else if (name === "model3D") {
      setFormData((prev) => ({
        ...prev,
        model3D: files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to post an auction.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("itemName", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("startingBid", formData.startingPrice);
    formDataToSend.append("closingTime", formData.endDate);
    formDataToSend.append("category", formData.category);

    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (formData.model3D) {
      formDataToSend.append("model3D", formData.model3D);
    }

    try {
      const response = await axios.post("http://localhost:5001/api/auction", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Update user's posted auctions
      await axios.put("http://localhost:5001/api/user/posted-auctions", {
        auctionId: response.data.auction._id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/my-auctions");
    } catch (err) {
      setError("Failed to post auction. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Post New Auction</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Starting Price</label>
            <input
              type="number"
              name="startingPrice"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.startingPrice}
              onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            name="category"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Select a category</option>
            <option value="art">Art</option>
            <option value="electronics">Electronics</option>
            <option value="collectibles">Collectibles</option>
            <option value="fashion">Fashion</option>
          </select>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <label htmlFor="imageUpload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-500">Click to upload images (Max: 5)</p>
            <input
              id="imageUpload"
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <label htmlFor="modelUpload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-500">Click to upload 3D Model (Optional)</p>
            <input
              id="modelUpload"
              type="file"
              name="model3D"
              accept=".stl,.amf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <Button type="submit" className="w-full">Post Auction</Button>
      </form>
    </div>
  );
};
