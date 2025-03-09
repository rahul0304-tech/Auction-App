import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";
import axios from "axios";

export const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sortBy: "newest", // default sort
    categories: []
  });

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get("https://auction-app-j7t8.onrender.com/api/auctions");
        setAuctions(response.data);
      } catch (err) {
        setError("Failed to fetch auctions.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Helper function to generate image URL safely
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "placeholder.jpg"; // This line should only return placeholder if imagePath is empty
    const normalizedPath = imagePath.replace(/\\/g, "/");
    const fullUrl = `https://auction-app-j7t8.onrender.com/${normalizedPath}`;

    console.log("🖼️ Image URL:", fullUrl); // Log the full URL
    return fullUrl;
  };

  // Filter auctions based on search query and filters
  const filteredAuctions = auctions
    .filter((auction) =>
      auction.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((auction) => {
      // Apply price filters
      if (filters.minPrice && auction.currentBid < parseFloat(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && auction.currentBid > parseFloat(filters.maxPrice)) {
        return false;
      }
      // Apply category filter if categories are selected
      if (filters.categories.length > 0 && !filters.categories.includes(auction.category)) {
        return false;
      }
      return true;
    });

  // Sort the filtered auctions
  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    switch (filters.sortBy) {
      case "priceAsc":
        return a.currentBid - b.currentBid;
      case "priceDesc":
        return b.currentBid - a.currentBid;
      case "alphabetical":
        return a.itemName.localeCompare(b.itemName);
      case "newest":
      default:
        // Assuming there's a createdAt field, otherwise fallback to _id
        return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
    }
  });

  // Get unique categories from auctions
  const categories = [...new Set(auctions.map(auction => auction.category))]
    .filter(Boolean) // Remove any undefined or null values
    .sort();

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      // Handle category checkboxes
      if (checked) {
        setFilters(prev => ({
          ...prev,
          categories: [...prev.categories, value]
        }));
      } else {
        setFilters(prev => ({
          ...prev,
          categories: prev.categories.filter(cat => cat !== value)
        }));
      }
    } else {
      // Handle other inputs
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
      categories: []
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Active Auctions</h1>
        <div className="flex space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="Search auctions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button 
            className={`flex items-center px-4 py-2 border rounded-lg ${showFilters ? "bg-gray-100" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters {showFilters ? <X className="w-4 h-4 ml-2" /> : null}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filter Options</h2>
            <button 
              onClick={resetFilters}
              className="text-blue-500 hover:underline"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min $"
                  className="w-full p-2 border rounded"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <span>to</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max $"
                  className="w-full p-2 border rounded"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="font-medium mb-2">Sort By</h3>
              <select
                name="sortBy"
                className="w-full p-2 border rounded"
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value="newest">Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="max-h-36 overflow-y-auto">
                {categories.length > 0 ? (
                  categories.map(category => (
                    <div key={category} className="mb-1">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="categories"
                          value={category}
                          checked={filters.categories.includes(category)}
                          onChange={handleFilterChange}
                          className="mr-2"
                        />
                        {category}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No categories available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {sortedAuctions.length} {sortedAuctions.length === 1 ? 'result' : 'results'}
          {(searchQuery || filters.minPrice || filters.maxPrice || filters.categories.length > 0) ? ' with applied filters' : ''}
        </p>
      </div>

      {/* Display Auctions */}
      {loading ? (
        <p className="text-center py-10">Loading...</p>
      ) : error ? (
        <p className="text-center py-10 text-red-500">{error}</p>
      ) : sortedAuctions.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No auctions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAuctions.map((auction) => (
            <Link key={auction._id} to={`/auctions/${auction._id}`} className="block">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={auction.imageRequired ? getImageUrl(auction.imageRequired) : "placeholder.jpg"}
                  alt={auction.itemName}
                  className="w-full h-48 object-contain"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{auction.itemName}</h3>
                  <p className="text-green-600 font-bold">${auction.currentBid}</p>
                  {auction.category && (
                    <p className="text-gray-500 text-sm mt-1">{auction.category}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Auctions;
