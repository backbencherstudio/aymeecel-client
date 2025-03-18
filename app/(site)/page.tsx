"use client";
import { IoChevronUpOutline, IoChevronDownOutline, IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";
import { getAllPost } from "@/apis/postDataApis";

interface Post {
    id: string;
    image: string;
    descriptions: string;
    createdAt: string;
    updatedAt: string;
}

interface ImageData {
    id: string;
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
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);
    const fetchPosts = async () => {
        try {
            const response = await getAllPost();
            const formattedData = response.posts.map((post: Post) => ({
                id: post.id,
                image: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/uploads/${post.image}`,
                descriptions: JSON.parse(post.descriptions)
            }));
            setData(formattedData);
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    };

    const handleDotClick = (index: number) => {
        setImageLoading(true);
        setSelectedImage(index);
        setTimeout(() => setImageLoading(false), 500);
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    const categories: (keyof ImageData['descriptions'])[] = ["AI", "Child", "Teenager", "Adult Expert"];

    return (
        <>
            <div className="bg-[linear-gradient(118deg,#9ABFBD_-1.71%,#EEF0EB_55.76%,#B69E93_100%)] min-h-screen px-2 sm:px-5 xl:px-0">
                <Navbar />
                <div className="flex justify-center mt-10 xl:mt-0  items-center xl:min-h-[calc(100vh-150px)]">
                    <div className="bg-transparent border-2 border-[#FFFFFF33] rounded-[2rem] shadow-lg max-w-5xl w-full">
                        <div className="flex flex-col md:flex-row w-full gap-3 md:gap-5">
                            {/* Sidebar with thumbnails - Modified for responsive */}
                            <div className="w-full md:w-[25%] rounded-s-[2rem] p-2 md:p-4">
                                <div className="flex md:flex-col justify-between items-center">
                                    {/* Mobile left arrow */}
                                    <div className="hidden sm:block md:hidden">
                                        <IoChevronBackOutline
                                            className="text-gray-400 text-3xl cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                setImageLoading(true);
                                                setSelectedImage(prev => Math.max(0, prev - 1));
                                                setTimeout(() => setImageLoading(false), 500);
                                            }}
                                        />
                                    </div>

                                    {/* Desktop up arrow */}
                                    <div className="hidden md:block">
                                        <IoChevronUpOutline
                                            className="text-gray-400 text-3xl cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                setImageLoading(true);
                                                setSelectedImage(prev => Math.max(0, prev - 1));
                                                setTimeout(() => setImageLoading(false), 500);
                                            }}
                                        />
                                    </div>

                                    <div className="mx-2 h-[120px] flex justify-center items-center md:my-5 flex-1 md:w-full">
                                        <div className="flex items-center md:block space-x-2 md:space-x-0 md:space-y-3 lg:max-h-[570px] overflow-x-auto md:overflow-y-auto image-scroll-container py-1">
                                            {data.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="flex-shrink-0 md:flex-shrink md:flex md:justify-center md:items-center"
                                                    onClick={() => {
                                                        setImageLoading(true);
                                                        setSelectedImage(index);
                                                        setTimeout(() => setImageLoading(false), 200);
                                                    }}
                                                >
                                                    <Image
                                                        width={500}
                                                        height={500}
                                                        src={item.image}
                                                        alt={`Image ${item.id}`}
                                                        className={`w-[75px]  h-[62px] sm:w-[65px] sm:h-[55px] md:w-[110px] md:h-[80px]  rounded-xl transition-all duration-200 ${selectedImage === index
                                                            ? 'w-[97px] h-[80px] sm:w-[97px] sm:h-[80px] md:w-[210px] md:h-[120px]  brightness-100'
                                                            : 'brightness-50 hover:brightness-75'
                                                            }`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mobile right arrow */}
                                    <div className="hidden sm:block md:hidden">
                                        <IoChevronForwardOutline
                                            className="text-gray-400 text-3xl cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                setImageLoading(true);
                                                setSelectedImage(prev => Math.min(data.length - 1, prev + 1));
                                                setTimeout(() => setImageLoading(false), 500);
                                            }}
                                        />
                                    </div>

                                    {/* Desktop down arrow */}
                                    <div className="hidden md:block">
                                        <IoChevronDownOutline
                                            className="text-gray-400 text-3xl cursor-pointer hover:text-gray-600"
                                            onClick={() => {
                                                setImageLoading(true);
                                                setSelectedImage(prev => Math.min(data.length - 1, prev + 1));
                                                setTimeout(() => setImageLoading(false), 500);
                                            }}
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
                            <div className="w-full py-5 md:py-5 md:w-[75%] bg-[#FFFFFF33] shadow-lg rounded-b-[2rem] md:rounded-s-none md:rounded-r-[2rem] p-2 md:p-4">
                                {data[selectedImage] && (
                                    <div className="flex flex-col h-full">
                                        <div className="rounded-2xl mb-4 w-full relative">
                                            {imageLoading ? (
                                                <div className="animate-pulse bg-gray-200 rounded-2xl w-full h-[220px] sm:h-[290px] md:h-[290px] lg:h-[360px]" />
                                            ) : (
                                                <>
                                                    {/* Blurred background image */}
                                                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                                                        <Image
                                                            width={1200}
                                                            height={800}
                                                            src={data[selectedImage].image}
                                                            alt=""
                                                            className="w-full h-full  object-cover scale-110 blur-md opacity-50"
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    </div>
                                                    {/* Main image */}
                                                    <div className="relative rounded-2xl flex justify-center items-center bg-transparent h-[220px] w-full sm:h-[290px] md:h-[290px] lg:h-[360px]">
                                                        <Image
                                                            width={500}
                                                            height={800}
                                                            src={data[selectedImage].image}
                                                            alt={`Image ${data[selectedImage].id}`}
                                                            className="rounded-2xl h-full w-auto max-w-full object-contain"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Category selector */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                                            {imageLoading ? (
                                                Array(4).fill(0).map((_, i) => (
                                                    <div key={i} className="animate-pulse bg-gray-100 border border-gray-200 h-10 rounded-[12.216px]" />
                                                ))
                                            ) : (
                                                categories.map(category => (
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
                                                ))
                                            )}
                                        </div>

                                        <div className={`bg-white rounded-[12.216px] p-4 flex-1 overflow-y-auto max-h-[230px] ${imageLoading ? 'animate-pulse' : ''}`}>
                                            {imageLoading ? (
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-200 rounded"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-700 text-[0.95rem] leading-relaxed">
                                                    {data[selectedImage].descriptions[selectedCategory]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>

    );
}




