'use client'
import React from 'react'
import CustomLangSwitcher from '../CustomLangSwitcher';
import NavbarIcon from '@/public/icon/navbarIcon';
import Link from 'next/link';

export default function Navbar() {

    return (
        <div className='container pt-10 px-2 sm:px-5 xl:px-0 py-4 flex justify-between items-center '>
            <Link href="https://www.1525.uzh.ch" target='_blank'>
                <NavbarIcon />
            </Link>

            <div className="relative">
                <CustomLangSwitcher />
            </div>
        </div>
    )
}
