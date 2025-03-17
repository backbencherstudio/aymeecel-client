'use client'
import React from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <nav className="bg-white bord shadow-md">
      <div className="px-4 py-4 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="text-gray-600 hover:text-gray-800 md:hidden"
        >
          <HiMenuAlt2 className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-4">
          {/* Add your navbar content here */}
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Add user profile, notifications, etc. */}
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </nav>
  );
}
