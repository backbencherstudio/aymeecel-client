"use client";
import { IoChevronUpOutline, IoChevronDownOutline, IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";

interface ImageData {
    id: number;
    image: string;
    descriptions: {
        AI: string;
        Child: string;
        Teenager: string;
        "Adult Expert": string;
    };
}

export default function Page() {
    const [data, setData] = useState<ImageData[]>([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<keyof ImageData['descriptions']>("Teenager");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('data.json')
            .then(response => response.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading data:', error);
                setLoading(false);
            });
    }, []);

    // Add new function to handle dot navigation
    const handleDotClick = (index: number) => {
        setSelectedImage(index);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const categories: (keyof ImageData['descriptions'])[] = ["AI", "Child", "Teenager", "Adult Expert"];

    return (
        <div className="bg-[linear-gradient(118deg,#9ABFBD_-1.71%,#EEF0EB_55.76%,#B69E93_100%)] min-h-screen px-2 sm:px-5 xl:px-0">
            <Navbar />
            <div className="flex justify-center mt-10 xl:mt-0  items-center xl:min-h-[calc(100vh-150px)]">
                <div className="bg-transparent border-2 border-[#FFFFFF33] rounded-[2rem] shadow-lg max-w-5xl w-full">
                    <div className="flex flex-col md:flex-row w-full gap-3 md:gap-5">
                        {/* Sidebar with thumbnails - Modified for responsive */}
                        <div className="w-full md:w-[25%] rounded-s-[2rem] p-2 md:p-4">
                            <div className="flex md:flex-col justify-between items-center">
                                {/* Mobile left arrow */}
                                <div className="md:hidden">
                                    <IoChevronBackOutline
                                        className="text-gray-400 text-3xl cursor-pointer hover:text-gray-600"
                                        onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}
                                    />
                                </div>

                                {/* Desktop up arrow */}
                                <div className="hidden md:block">
                                    <IoChevronUpOutline
                                        className="text-gray-400 text-3xl cursor-pointer hover:text-gray-600"
                                        onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}
                                    />
                                </div>

                                <div className="mx-2  flex justify-center items-center md:my-5 flex-1 md:w-full">
                                    <div className="flex items-center md:block space-x-2 md:space-x-0 md:space-y-3 lg:max-h-[570px] overflow-x-auto md:overflow-y-auto image-scroll-container py-1">
                                        {data.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="flex-shrink-0 md:flex-shrink md:flex md:justify-center md:items-center"
                                                onClick={() => setSelectedImage(index)}
                                            >
                                                <Image
                                                    width={500}
                                                    height={500}
                                                    src={item.image}
                                                    alt={`Image ${item.id}`}
                                                    className={`w-[75px] h-[62px] sm:w-[62px] sm:h-[51px] md:w-[110px] md:h-[80px] rounded-xl transition-all duration-200 ${selectedImage === index
                                                        ? 'w-[97px] h-[80px] md:w-[210px] md:h-[120px] object-cover brightness-100'
                                                        : 'brightness-50 hover:brightness-75'
                                                        }`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Mobile right arrow */}
                                <div className="md:hidden">
                                    <IoChevronForwardOutline
                                        className="text-gray-400 text-3xl cursor-pointer hover:text-gray-600"
                                        onClick={() => setSelectedImage(prev => Math.min(data.length - 1, prev + 1))}
                                    />
                                </div>

                                {/* Desktop down arrow */}
                                <div className="hidden md:block">
                                    <IoChevronDownOutline
                                        className="text-gray-400 text-3xl cursor-pointer hover:text-gray-600"
                                        onClick={() => setSelectedImage(prev => Math.min(data.length - 1, prev + 1))}
                                    />
                                </div>
                            </div>
                            {/* Mobile Dots Navigation */}
                            <div className="flex mt-5 md:hidden justify-center items-center gap-2">
                                {data.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleDotClick(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-200 ${selectedImage === index ? 'bg-gray-800 w-4' : 'bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>


                        {/* Main content */}
                        <div className="w-full py-10 md:py-5 md:w-[75%] bg-[#FFFFFF33] shadow-lg rounded-b-[2rem] md:rounded-s-none lg:rounded-r-[2rem] p-2 md:p-4">
                            {data[selectedImage] && (
                                <>
                                    <div className="rounded-2xl mb-4">
                                        <Image
                                            width={700}
                                            height={700}
                                            src={data[selectedImage].image}
                                            alt={`Image ${data[selectedImage].id}`}
                                            className="rounded-2xl w-full h-[220px] sm:h-[290px] sm:w-full md:h-[290px] md:w-full lg:h-[360px] lg:w-full mx-auto "
                                        />
                                    </div>

                                    {/* Category selector */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`px-4 py-2 rounded-[12.216px] ${selectedCategory === category
                                                    ? 'bg-[#213C3A]  text-white'
                                                    : 'bg-[#FFF]'
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-[12.216px] p-4">
                                        <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                                            {data[selectedImage].descriptions[selectedCategory]}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




