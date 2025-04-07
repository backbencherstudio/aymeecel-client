'use client'
import React from 'react'
import logo from '../../public/logo/logo.png';
import CustomImage from '../Reusable/CustomImage/CustomImage';
import CustomLangSwitcher from '../CustomLangSwitcher';

export default function Navbar() {

    return (
        <div className='container pt-10 px-2 sm:px-5 xl:px-0 py-4 flex justify-between items-center '>
            <div>
                <CustomImage
                    src={logo.src}
                    alt="logo"
                    width={200}
                    height={100}
                    className='md:w-32 md:h-auto h-[78px] w-[117px]'

                />
            </div>

            <div className="relative">

                {/* <LanguageSwitcher /> */}
                <CustomLangSwitcher />
            </div>
        </div>
    )
}
