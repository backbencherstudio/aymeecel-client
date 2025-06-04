import React from 'react';
import sublogo from '@/public/logo/icon.svg'
import Link from 'next/link';
import CustomImage from '../Reusable/CustomImage/CustomImage';
import FooterIcon from '@/public/icon/footerIcon';

export default function Footer() {
    return (
        <footer className=" bg-white py-10">
            <div className="container px-2 sm:px-5 xl:px-0">
                {/* Logo section */}
                <div className="flex gap-10 md:gap-5 items-start md:items-center mb-8">
                    <Link href="https://www.theologie.uzh.ch/en.html#:~:text=The%20Faculty%20of%20Theology%20and,qualified%20research%20and%20teaching%20staff." target="_blank" className="w-[176px] h-[60px]">
                        <FooterIcon />

                    </Link>
                    <Link href="https://www.digitalreligions.uzh.ch/en.html" target="_blank" className="w-[60px] h-[60px]">
                        <CustomImage src={sublogo.src} width={200} height={200} alt="University of Zurich logo" className="w-full h-full" />

                    </Link>
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