'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoClose } from 'react-icons/io5';
import {
    HiHome,
    HiCog,
    HiPencilAlt,
    HiCollection
} from 'react-icons/hi';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { icon: HiHome, label: 'Dashboard', href: '/dashboard' },
        { icon: HiPencilAlt, label: 'Create Post', href: '/dashboard/create-post' },
        { icon: HiCollection, label: 'All Posts', href: '/dashboard/all-posts' },
        { icon: HiCog, label: 'Settings', href: '/dashboard/settings' },
    ];

    return (
        <div className="w-64 h-screen bg-white shadow-lg">
            <div className="py-4 px-3 flex justify-between items-center border-b border-gray-400 ">
                <h2 className="text-xl font-bold mb-1">Admin Panel</h2>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-100 md:hidden"
                >
                    <IoClose className="h-6 w-6" />
                </button>
            </div>

            <nav className="mt-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link href={item.href}>
                                    <span
                                        className={`flex items-center px-4 py-2 transition-colors duration-200
                      ${isActive
                                                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : ''}`} />
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
