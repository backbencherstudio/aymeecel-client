import React from 'react';
import sublogo from '@/public/logo/sublogo.png'
import Link from 'next/link';
import CustomImage from '../Reusable/CustomImage/CustomImage';
import FooterIcon from '@/public/icon/footerIcon';

export default function Footer() {
    return (
        <footer className=" bg-white py-10">
            <div className="container px-2 sm:px-5 xl:px-0">
                {/* Logo section */}
                <div className="flex gap-10 md:gap-5 items-start md:items-center mb-8">
                    <div className="w-[176px] h-[60px]">
                        <FooterIcon />

                    </div>
                    <div className="w-[65px] h-[65px]">
                        <CustomImage src={sublogo.src} width={200} height={100} alt="University of Zurich logo" className="w-full h-full" />

                    </div>
                </div>

                {/* Divider line */}
                <div className="border-t border-[#000] mb-4"></div>

                {/* Links and copyright section */}
                <div className="flex gap-10 md:gap-0 flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center">
                        <ul className="flex space-x-6">
                            <li>
                                <Link href="https://www.uzh.ch/de/privacy" target="_blank" className="text-sm underline text-[#000] hover:text-gray-800">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-sm text-[#000]">© {new Date().getFullYear()} UZH. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}