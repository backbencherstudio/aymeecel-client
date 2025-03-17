'use client'
import React from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FiSearch } from 'react-icons/fi';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useUser();

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 py-4 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="text-gray-600 hover:text-gray-800 md:hidden"
        >
          <HiMenuAlt2 className="h-6 w-6" />
        </button>

        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Hide search bar on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          {/* Hide notifications on mobile */}
          <button className="hidden md:block relative text-gray-600 hover:text-gray-800">
            <IoNotificationsOutline className="h-6 w-6" />
            {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span> */}
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              {user?.image && (
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <Image
                    src={user?.image}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
              )}
              <span className="text-gray-700 capitalize">{user?.name}</span>
            </div>
          ) : (
            <span className="text-gray-500">Loading...</span>
          )}
        </div>
      </div>
    </nav>
  );
}
