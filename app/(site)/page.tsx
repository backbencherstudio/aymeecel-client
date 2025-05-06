"use client";
import { IoChevronUpOutline, IoChevronDownOutline, IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";
import { getAllPost } from "@/apis/postDataApis";
import CustomImage from "@/components/Reusable/CustomImage/CustomImage";
import { useLanguage } from '@/context/LanguageContext';

interface Post {
    id: string;
    image: string;
    descriptions_en: string;
    descriptions_de: string;
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

const translations = {
    en: {
        welcome: "Welcome!",
        welcomeText1: `For the 500 th anniversary of the "Prophezy" we at the Faculty of Theology and Religious 
            Studies and the URPP in Digital Religion(s) at the University of Zurich have explored how 
            religious objects from 1500-1600 are seen through several different kinds of eyes: those 
            of humans – a child, a teenager, and religious experts – and the digital 'eyes' of Artificial 
            Intelligence.`,
        welcomeText2: `You can click the labelled buttons below and compare these different ways of 'seeing' and 
            develop your own conclusions about how we gain knowledge about religion in an 
            increasingly AI filtered world.`,
        imageCredit: `Images granted by the generosity of the Rettberg Museum and Wikimedia commons, and used under creative 
            commons license CC BY-SA 2.0`
    },
    de: {
        welcome: "Herzlich willkommen!",
        welcomeText1: `Zum 500-Jahr-Jubiläum der „Prophezey“ haben Wissenschaftler:innen der Theologischen und Religionswissenschaftlichen Fakultät und des UFSP Digital Religion(s) der Universität Zürich untersucht, wie religiöse Objekte aus den Jahren 1500–1600 durch unterschiedliche Augen gesehen werden: durch die von Menschen – einem Kind, einem Teenager und religiösen Experten – und durch die digitalen „Augen“ von Künstlicher Intelligenz.`,
        welcomeText2: `Klicken Sie unten auf die beschrifteten Schaltflächen, um diese unterschiedlichen Arten des „Sehens“ zu vergleichen und Ihre eigenen Schlussfolgerungen darüber ziehen, wie wir in einer zunehmend von KI gefilterten Welt Wissen über Religion erlangen.`,
        imageCredit: `Bilder wurden dankenswerterweise vom Rietberg Museum und Wikimedia Commons zur Verfügung gestellt und werden unter der Creative Commons-Lizenz CC BY-SA 3.0 verwendet.`
    }
};

const categoryTranslations = {
    en: {
        "AI": "AI",
        "Child": "Child",
        "Teenager": "Teenager",
        "Adult Expert": "Adult Expert"
    },
    de: {
        "AI": "KI",
        "Child": "Kind",
        "Teenager": "Jugendlicher",
        "Adult Expert": "Erwachsener Experte"
    }
};

export default function Home() {
    const [data, setData] = useState<ImageData[]>([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<keyof ImageData['descriptions']>("Teenager");
    const [loading, setLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(false);
    const { selectedLang } = useLanguage();

    const fetchPosts = useCallback(async () => {
        try {
            const response = await getAllPost(1, 100, selectedLang as 'en' | 'de');
            const formattedData = response?.posts?.map((post: Post) => {
                const descriptionsField = selectedLang === 'en' ? 'descriptions_en' : 'descriptions_de';
                let descriptions;
                try {
                    descriptions = typeof post[descriptionsField] === 'string'
                        ? JSON.parse(post[descriptionsField])
                        : post[descriptionsField];

                    // Fallback to English if German is not available
                    if (!descriptions && descriptionsField === 'descriptions_de') {
                        descriptions = typeof post.descriptions_en === 'string'
                            ? JSON.parse(post.descriptions_en)
                            : post.descriptions_en;
                    }
                } catch (error) {
                    console.error('Error parsing descriptions:', error);
                    descriptions = {
                        AI: '',
                        Child: '',
                        Teenager: '',
                        "Adult Expert": ''
                    };
                }

                return {
                    id: post.id,
                    image: post.image,
                    descriptions: descriptions
                };
            });
            setData(formattedData);
            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    }, [selectedLang]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const renderHTML = (content: string) => {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    };

    const handleDotClick = (index: number) => {
        setImageLoading(true);
        setSelectedImage(index);
        setTimeout(() => setImageLoading(false), 500);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        </div>;
    }
    const categories: (keyof ImageData['descriptions'])[] = ["AI", "Child", "Teenager", "Adult Expert"];

    return (
        <>

            <div className="bg-[linear-gradient(118deg,#9ABFBD_-1.71%,#EEF0EB_55.76%,#B69E93_100%)] min-h-screen px-2 sm:px-5 xl:px-0">
                <Navbar />

                {/* welcome card  */}
                <div className="max-w-5xl mx-auto px-2 sm:px-5 xl:px-0 py-8">
                    <div className="rounded-[40px] bg-white/20 p-4 sm:p-8 lg:p-[64px] relative overflow-hidden shadow-[inset_0px_-6px_20.8px_rgba(255,255,255,0.60)] w-full">
                        <h1 className="text-[32px] lg:text-[56px] font-[700] mb-4">
                            {translations[selectedLang as keyof typeof translations].welcome}
                        </h1>
                        <p className="mb-4 text-[16px] md:text-[18px] font-[400] leading-[27px]">
                            {translations[selectedLang as keyof typeof translations].welcomeText1}
                        </p>
                        <p className="mb-4 text-[16px] md:text-[18px] font-[400] leading-[27px]">
                            {translations[selectedLang as keyof typeof translations].welcomeText2}
                        </p>
                        <p className="text-sm font-[400] italic">
                            {translations[selectedLang as keyof typeof translations].imageCredit}
                        </p>
                    </div>
                </div>


                {/* main card */}
                <div className="max-w-5xl mx-auto px-2 sm:px-5 xl:px-0 py-10 xl:mt-0">
                    <div className="rounded-[40px] bg-white/20 relative overflow-hidden shadow-[inset_0px_-6px_20.8px_rgba(255,255,255,0.60)] w-full">
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
                                            {data?.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="flex-shrink-0 md:flex-shrink md:flex md:justify-center md:items-center cursor-pointer"
                                                    onClick={() => {
                                                        setImageLoading(true);
                                                        setSelectedImage(index);
                                                        setTimeout(() => setImageLoading(false), 200);
                                                    }}
                                                >
                                                    <CustomImage
                                                        width={500}
                                                        height={500}
                                                        src={item?.image}
                                                        alt='not found'
                                                        className={`object-cover rounded-[6.805px] md:rounded-[18.324px] transition-all duration-200 
                                                            ${selectedImage === index
                                                                ? 'w-[85px] h-[65px] sm:w-[95px] sm:h-[75px] md:w-[110px] md:h-[90px] lg:w-[213px] lg:h-[125px]'
                                                                : 'w-[75px] h-[55px] sm:w-[85px] sm:h-[65px] md:w-[100px] md:h-[75px] lg:w-[120px] lg:h-[90px] brightness-30 hover:brightness-75'
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
                                    {data?.map((_, index) => (
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
                                                        <CustomImage
                                                            width={500}
                                                            height={500}
                                                            src={data[selectedImage]?.image}
                                                            alt="not found"
                                                            className="w-full h-full object-cover scale-110 blur-lg brightness-60 bg-black/80"
                                                            style={{ width: '100%', height: '100%' }}
                                                        />
                                                    </div>
                                                    {/* Main image */}
                                                    <div className="relative rounded-2xl flex justify-center items-center bg-transparent h-[190px] w-full sm:h-[290px] md:h-[290px] lg:h-[360px]">
                                                        <CustomImage
                                                            width={500}
                                                            height={500}
                                                            src={data[selectedImage]?.image}
                                                            alt="not found"
                                                            className="rounded-2xl h-full w-auto max-w-full "
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
                                                categories?.map(category => (
                                                    <button
                                                        key={category}
                                                        onClick={() => setSelectedCategory(category)}
                                                        className={`px-4 cursor-pointer py-2 rounded-[12.216px] transition-all duration-300 
                                                            ${selectedCategory === category
                                                                ? 'bg-[#213C3A] text-white  border border-[#213C3A]'
                                                                : 'bg-[#FFF] hover:shadow-[0_0_10px_rgba(255,255,255,0.7)] hover:border hover:border-white'
                                                            } ${category === 'Teenager' && selectedCategory !== category
                                                                ? 'hover:text-[#213C3A] hover:bg-opacity-90'
                                                                : ''
                                                            }`}
                                                    >
                                                        <span className={`${selectedCategory === category ? 'text-shadow-neon' : ''}`}>
                                                            {categoryTranslations[selectedLang as keyof typeof categoryTranslations][category]}
                                                        </span>
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
                                                <div className="text-gray-700 px-5 text-[0.95rem] leading-relaxed prose prose-sm max-w-none [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:pl-[40px] [&_ul]:pl-[40px]">
                                                    {renderHTML(data[selectedImage]?.descriptions[selectedCategory] || '')}
                                                </div>
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




