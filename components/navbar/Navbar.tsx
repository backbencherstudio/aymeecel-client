'use client'
import React, { useState } from 'react'
import logo from '../../public/logo/logo.png'
import Image from 'next/image'
import { IoIosArrowDown } from 'react-icons/io';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState('EN');

    const handleLanguageSelect = (lang: string) => {
        setSelectedLang(lang);
        setIsOpen(false);
    };

    return (
        <div className='container pt-10 px-2 sm:px-5 xl:px-0 py-4 flex justify-between items-center '>
        <div>
            <Image
                src={logo}
                alt="logo"
                width={200}
                height={100}
                className='md:w-32 md:h-auto h-[78px] w-[117px]'
                priority
            />
        </div>

        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center gap-1 text-md font-medium"
            >
                <span>{selectedLang}</span>

                <IoIosArrowDown className={`text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`} />

            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white/90 backdrop-blur-sm rounded-md shadow-lg py-1">
                    <button
                        onClick={() => handleLanguageSelect('EN')}
                        className={`block cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100/50 ${selectedLang === 'EN' ? 'bg-gray-50/50' : ''}`}
                    >
                        EN | English
                    </button>
                    <button
                        onClick={() => handleLanguageSelect('DE')}
                        className={`block cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100/50 ${selectedLang === 'DE' ? 'bg-gray-50/50' : ''}`}
                    >
                        DE | Deutsch
                    </button>
                </div>
            )}
        </div>
    </div>
    )
}
