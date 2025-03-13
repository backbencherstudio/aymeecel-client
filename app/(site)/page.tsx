"use client";
import { IoChevronUpOutline, IoChevronDownOutline } from "react-icons/io5";
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

    if (loading) {
        return <div>Loading...</div>;
    }

    const categories: (keyof ImageData['descriptions'])[] = ["AI", "Child", "Teenager", "Adult Expert"];

    return (
        <div className="bg-[linear-gradient(118deg,#9ABFBD_-1.71%,#EEF0EB_55.76%,#B69E93_100%)] min-h-screen px-2 sm:px-5 xl:px-0">
            <Navbar />
            <div className="flex justify-center mt-5 sm:mt-0 items-center min-h-[calc(100vh-150px)]">
                <div className="bg-transparent border border-[#FFFFFF33] rounded-[2rem] shadow-lg max-w-5xl w-full">
                    <div className="flex flex-col md:flex-row w-full gap-3 md:gap-5">
                        {/* Sidebar with thumbnails */}
                        <div className="w-full md:w-[25%] p-2 md:p-4">
                            <div className="flex md:flex-col justify-between items-center">
                                <IoChevronUpOutline
                                    className="text-gray-400 text-3xl rotate-90 md:rotate-0 cursor-pointer hover:text-gray-600"
                                    onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}
                                />

                                <div className="mx-2 md:my-5 flex-1 md:w-full">
                                    <div className="flex md:block space-x-2 md:space-x-0 md:space-y-3 md:max-h-[570px] overflow-y-auto image-scroll-container py-1">
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
                                                    className={`w-[75px] h-[62px] sm:w-[62px] sm:h-[51px] md:w-[110px] md:h-[80px] rounded-xl transition-all duration-200 ${
                                                        selectedImage === index
                                                            ? 'w-[97px] h-[80px] md:w-[210px] md:h-[120px] object-cover brightness-100'
                                                            : 'brightness-50 hover:brightness-75'
                                                    }`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <IoChevronDownOutline
                                    className="text-gray-400 text-3xl rotate-90 md:rotate-0 cursor-pointer hover:text-gray-600"
                                    onClick={() => setSelectedImage(prev => Math.min(data.length - 1, prev + 1))}
                                />
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="w-full md:w-[75%] shadow-lg rounded-r-[2rem] p-2 md:p-4">
                            {data[selectedImage] && (
                                <>
                                    <div className="rounded-2xl overflow-hidden mb-4">
                                        <Image
                                            width={500}
                                            height={500}
                                            src={data[selectedImage].image}
                                            alt={`Image ${data[selectedImage].id}`}
                                            className="w-full h-[360px] object-cover"
                                        />
                                    </div>

                                    {/* Category selector */}
                                    <div className="flex gap-2 mb-4">
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`px-4 py-2 rounded ${
                                                    selectedCategory === category
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200'
                                                }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-2xl p-4">
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




