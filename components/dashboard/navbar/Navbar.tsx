'use client'
import React from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { FiSearch } from 'react-icons/fi';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useUser();

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 py-3 md:py-4 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="text-gray-600 hover:text-gray-800 md:hidden"
        >
          <HiMenuAlt2 className="h-6 w-6" />
        </button>

        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Hide search bar on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search..."
                autoComplete="off"
                name="search"
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-600"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          <LanguageSwitcher />

          {user ? (
            <div className="flex items-center space-x-2 md:space-x-3">
              {user?.image && (
                <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={user?.image}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                    priority
                  />
                </div>
              )}
              <span className="text-sm md:text-base text-gray-700 capitalize hidden sm:block">
                {user?.name}
              </span>
            </div>
          ) : (
            <span className="text-gray-500 text-sm md:text-base">Loading...</span>
          )}
        </div>
      </div>
    </nav>
  );
}
