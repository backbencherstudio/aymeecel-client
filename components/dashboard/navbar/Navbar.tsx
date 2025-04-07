'use client'
import React from 'react';
import { HiMenuAlt2 } from 'react-icons/hi';
import { useUser } from '@/context/UserContext';
import CustomImage from '@/components/Reusable/CustomImage/CustomImage';
import CustomLangSwitcher from '@/components/CustomLangSwitcher';


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

          {/* <LanguageSwitcher /> */}
          <CustomLangSwitcher />

          {user ? (
            <div className="flex items-center space-x-2 md:space-x-3">
              {user?.image && (
                <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                  <CustomImage
                    src={user?.image}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    style={{ width: '100%', height: '100%' }}

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
