import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link to="/">
          <Button className="flex items-center">
            <HomeIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};