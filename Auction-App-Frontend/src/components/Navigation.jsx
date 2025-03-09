import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bell } from 'lucide-react';
import { Button } from './ui/Button';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // Redirect to home page after logout
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/"); // Redirect to home page after login
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            AuctionApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isLoggedIn ? (
              <>
                <Link to="/auctions" className="text-gray-600 hover:text-gray-900">
                  Browse Auctions
                </Link>
                <Link to="/my-auctions" className="text-gray-600 hover:text-gray-900">
                  My Auctions
                </Link>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-600 hover:text-gray-900">
                    <Bell className="w-6 h-6" />
                  </button>
                  <Link to="/profile">
                    <Button variant="outline" className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/signin" className="text-gray-600 hover:text-gray-900" onClick={handleLogin}>
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/signup" className="text-gray-600 hover:text-gray-900" onClick={handleLogin}>
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {isLoggedIn ? (
                <>
                  <Link to="/auctions" className="text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
                    Browse Auctions
                  </Link>
                  <Link to="/my-auctions" className="text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
                    My Auctions
                  </Link>
                  <Link to="/profile" className="text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>
                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
                    <Button variant="outline">Sign In</Button>
                  </Link>
                  <Link to="/signup" className="text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(false)}>
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
