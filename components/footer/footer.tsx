import React from 'react';
import logo from '@/public/logo/log.png'
import Link from 'next/link';
import CustomImage from '../Reusable/CustomImage/CustomImage';

export default function Footer() {
    return (
        <footer className=" bg-white py-10">
            <div className="container px-2 sm:px-5 xl:px-0">
                {/* Logo section */}
                <div className="flex flex-col md:flex-row gap-10 md:gap-0 justify-between items-start md:items-center mb-8">
                    <div className="flex items-center">
                        <CustomImage src={logo.src} width={200} height={100} alt="University of Zurich logo" className="w-[228px] h-[77px]" />

                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="bg-gray-300 px-4 py-1 text-sm text-gray-600">LOGO</div>
                        <div className="bg-gray-300 px-4 py-1 text-sm text-gray-600">LOGO</div>
                        <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full border border-gray-300 mr-1"></div>
                            <span className="text-gray-500 text-sm">Logo</span>
                        </div>
                    </div>
                </div>

                {/* Divider line */}
                <div className="border-t-2 border-gray-200 mb-4"></div>

                {/* Links and copyright section */}
                <div className="flex gap-10 md:gap-0 flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center">
                        <ul className="flex space-x-6">
                            <li>
                                <Link href="https://www.uzh.ch/de/privacy" target="_blank" className="text-sm text-gray-600 hover:text-gray-800">
                                    Privacy Policy
                                </Link>
                            </li>
                            {/* <li>
                                <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
                                    Cookies Settings
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">© {new Date().getFullYear()} UZH. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}