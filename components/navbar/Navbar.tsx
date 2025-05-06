'use client'
import React from 'react'
import CustomLangSwitcher from '../CustomLangSwitcher';
import NavbarIcon from '@/public/icon/navbarIcon';

export default function Navbar() {

    return (
        <div className='container pt-10 px-2 sm:px-5 xl:px-0 py-4 flex justify-between items-center '>
            <div>
                <NavbarIcon />
            </div>

            <div className="relative">
                <CustomLangSwitcher />
            </div>
        </div>
    )
}
