
'use client'
import ProtectedLayout from '@/auth/ProtectedLayout';
import Navbar from '@/components/dashboard/navbar/Navbar';
import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ProtectedLayout>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 md:static md:translate-x-0 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onMenuClick={toggleSidebar} />
          
          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
            {children}
            <Toaster position="top-center" />
          </main>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default DashboardLayout;
