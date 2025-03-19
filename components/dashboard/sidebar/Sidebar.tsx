'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import {
    HiHome,
    HiCog,
    HiPencilAlt,
    HiCollection,
} from 'react-icons/hi';
import { useUser } from '@/context/UserContext';
import { HiArrowRightOnRectangle } from "react-icons/hi2";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({  onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { setUser } = useUser();

    const handleLogout = () => {
        // Clear user data and token
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    const menuItems = [
        { icon: HiHome, label: 'Dashboard', href: '/dashboard' },
        { icon: HiPencilAlt, label: 'Create Post', href: '/dashboard/create-post' },
        { icon: HiCollection, label: 'All Posts', href: '/dashboard/all-posts' },
        { icon: HiCog, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="w-64 h-screen bg-white shadow-lg flex flex-col">
            <div className="py-5 px-3 flex justify-between items-center border-b border-gray-400">
                <h2 className="text-xl font-bold mb-1">Admin Panel</h2>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 md:hidden"
                >
                    <IoClose className="h-6 w-6" />
                </button>
            </div>

            <nav className="mt-4 flex-1">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link href={item.href}>
                                    <span
                                        className={`flex items-center px-4 py-2 transition-colors duration-200
                                            ${isActive
                                                ? 'bg-blue-50 text-indigo-600 border-r-4 border-indigo-600 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-600' : ''}`} />
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout button */}
            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer w-full px-4 py-2 text-gray-700 hover:bg-indigo-600 hover:text-white rounded-md transition-colors duration-300 group"
                >
                    <HiArrowRightOnRectangle className="h-5 w-5 mr-3 transition-transform duration-300 group-hover:translate-x-1" />
                    Logout
                </button>
            </div>
        </div>
    );
}
